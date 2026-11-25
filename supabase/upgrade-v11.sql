-- Dedicated Península project only. Run schema.sql first, then this file. No QuoteCore+.
begin;
alter table public.enquiries add column if not exists email text not null default '';
alter table public.enquiries add column if not exists channel text not null default 'legacy' check(channel in ('legacy','whatsapp','inbox'));
alter table public.enquiries add column if not exists message text not null default '';
alter table public.enquiries add column if not exists request_id uuid unique;
alter table public.enquiries add column if not exists calendar_id uuid references public.calendar_blocks(id) on delete set null;
alter table public.calendar_blocks add column if not exists shareable boolean not null default false;
alter table public.calendar_blocks add column if not exists group_level text not null default 'beginner' check(group_level in ('first','beginner','intermediate','advanced','any'));
alter table public.calendar_blocks add column if not exists open_spots integer not null default 0 check(open_spots between 0 and 100);
alter table public.calendar_blocks drop constraint if exists calendar_blocks_kind_check;
alter table public.calendar_blocks add constraint calendar_blocks_kind_check check(kind in ('lesson','rest','travel','off','busy','available'));
alter table public.operating_hours add column if not exists slow_weekend boolean not null default false;
create table if not exists public.concierge_rate(id bigint generated always as identity primary key, fingerprint text not null, created_at timestamptz not null default now());
alter table public.concierge_rate enable row level security;
revoke all on public.concierge_rate from public,anon,authenticated;
grant all on public.concierge_rate to service_role;
grant usage,select on sequence public.concierge_rate_id_seq to service_role;
create index if not exists concierge_rate_idx on public.concierge_rate(fingerprint,created_at);
create or replace function public.allow_concierge_turn(p_fingerprint text) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 -- Global lock enforces a real application-level daily cap, not merely a budget alert.
 perform pg_advisory_xact_lock(187385811);
 delete from public.concierge_rate where created_at < now()-interval '1 day';
 if (select count(*) from public.concierge_rate)>=300 or (select count(*) from public.concierge_rate where fingerprint=p_fingerprint and created_at>now()-interval '10 minutes')>=16 then return false;end if;
 insert into public.concierge_rate(fingerprint) values(p_fingerprint);return true;
end $$;
create or replace function public.submit_concierge(p_payload jsonb,p_fingerprint text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare new_id uuid; existing public.enquiries%rowtype;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_fingerprint,0));
 perform pg_advisory_xact_lock(hashtextextended(p_payload->>'request_id',1));
 select * into existing from public.enquiries where request_id=(p_payload->>'request_id')::uuid;
 if found then
   if existing.message<>p_payload->>'message' or existing.channel<>p_payload->>'channel' then raise exception 'Conflicting retry';end if;
   return jsonb_build_object('id',existing.id,'created',false);
 end if;
 delete from public.enquiry_rate where created_at < now()-interval '1 day';
 if (select count(*) from public.enquiry_rate where fingerprint=p_fingerprint and created_at>now()-interval '10 minutes')>=5 then return null;end if;
 insert into public.enquiry_rate(fingerprint) values(p_fingerprint);
 insert into public.enquiries(locale,service,name,phone,email,channel,message,request_id,preferred_date,preferred_time,duration,group_size,experience,notes) values(p_payload->>'locale',(p_payload->>'service')::int,p_payload->>'name',p_payload->>'phone',p_payload->>'email',p_payload->>'channel',p_payload->>'message',(p_payload->>'request_id')::uuid,(p_payload->>'preferred_date')::date,p_payload->>'preferred_time',p_payload->>'duration',p_payload->>'group_size',p_payload->>'experience',p_payload->>'notes') returning id into new_id;
 return jsonb_build_object('id',new_id,'created',true);
end $$;
-- Owner-only, atomic, idempotent: new booking or join a manually selected existing group.
create or replace function public.confirm_surf_booking(p_enquiry uuid,p_event uuid,p_start timestamptz,p_end timestamptz,p_title text,p_people integer) returns uuid language plpgsql security invoker set search_path='' as $$
declare q public.enquiries%rowtype; b public.calendar_blocks%rowtype; bid uuid;
begin
 select * into q from public.enquiries where id=p_enquiry for update;
 if not found then raise exception 'Enquiry missing';end if;
 if q.calendar_id is not null then return q.calendar_id;end if;
 if p_event is not null then
  select * into b from public.calendar_blocks where id=p_event for update;
  if not found or b.kind<>'lesson' or not b.shareable or p_people<1 or p_people>b.open_spots then raise exception 'Group no longer has space';end if;
  update public.calendar_blocks set open_spots=open_spots-p_people where id=p_event;bid=p_event;
 else
  if p_end<=p_start then raise exception 'Invalid time';end if;
  insert into public.calendar_blocks(kind,starts_at,ends_at,title,enquiry_id) values('lesson',p_start,p_end,p_title,p_enquiry) returning id into bid;
 end if;
 update public.enquiries set calendar_id=bid,state='confirmed' where id=p_enquiry;
 return bid;
end $$;
revoke all on function public.allow_concierge_turn(text),public.submit_concierge(jsonb,text),public.confirm_surf_booking(uuid,uuid,timestamptz,timestamptz,text,integer) from public,anon,authenticated;
grant execute on function public.allow_concierge_turn(text),public.submit_concierge(jsonb,text),public.confirm_surf_booking(uuid,uuid,timestamptz,timestamptz,text,integer) to service_role;
-- Older schema used an end>start constraint; overnight working windows are now supported.
alter table public.operating_hours drop constraint if exists operating_hours_check;
commit;
