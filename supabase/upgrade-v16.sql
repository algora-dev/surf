-- Dedicated Península project only. Additive; apply before v1.6 deploy.
begin;
alter table public.enquiries drop constraint if exists enquiries_channel_check;
alter table public.enquiries add constraint enquiries_channel_check check(channel in ('legacy','whatsapp','inbox','email'));
alter table public.enquiries add column if not exists email_attempts integer not null default 0;
alter table public.enquiries add column if not exists email_attempted_at timestamptz;
alter table public.enquiries add column if not exists email_state text not null default 'pending' check(email_state in ('pending','accepted','failed'));

alter table public.calendar_blocks add column if not exists private_notes text not null default '' check(char_length(private_notes)<=2000);
alter table public.calendar_blocks add column if not exists payment_status text not null default 'unspecified' check(payment_status in ('unspecified','agreed','deposit','paid','outstanding'));
alter table public.calendar_blocks add column if not exists reminder_minutes integer check(reminder_minutes in (0,30,60,120,1440));
-- Existing previews may lack new fields: invalidate only unconfirmed proposals.
update public.admin_proposals set expires_at=now() where applied_at is null and expires_at>now();
create or replace function public.apply_admin_proposal(p_id uuid,p_owner uuid) returns jsonb language plpgsql security invoker set search_path='' as $$
declare p public.admin_proposals%rowtype; c jsonb; a jsonb; prior jsonb; current_row jsonb; overlap_rows jsonb; bid uuid;
begin
 select * into p from public.admin_proposals where id=p_id and owner_id=p_owner for update;
 if not found then return jsonb_build_object('ok',false);end if;
 if p.applied_at is not null then return jsonb_build_object('ok',true,'event_id',p.result_id);end if;
 if p.expires_at<=now() then return jsonb_build_object('ok',false);end if;
 c=p.change;a=c->'after';prior=c->'before';
 -- Serialize with all manual calendar writes, including inserts. Recheck exact preview state.
 lock table public.calendar_blocks in share row exclusive mode;
 if c->>'operation' in ('update','delete') then
  bid=(c->>'id')::uuid;
  select to_jsonb(b) into current_row from public.calendar_blocks b where b.id=bid;
  if current_row is distinct from to_jsonb(jsonb_populate_record(null::public.calendar_blocks,prior)) then return jsonb_build_object('ok',false);end if;
 end if;
 if c->>'operation' in ('create','update') then
  select coalesce(jsonb_agg(to_jsonb(b) order by b.id),'[]'::jsonb) into overlap_rows from public.calendar_blocks b where (bid is null or b.id<>bid) and b.starts_at<(a->>'ends_at')::timestamptz and b.ends_at>(a->>'starts_at')::timestamptz;
  if overlap_rows is distinct from (select coalesce(jsonb_agg(to_jsonb(jsonb_populate_record(null::public.calendar_blocks,x)) order by x->>'id'),'[]'::jsonb) from jsonb_array_elements(c->'overlaps') as j(x)) then return jsonb_build_object('ok',false);end if;
 end if;
 if c->>'operation'='create' then
  insert into public.calendar_blocks(kind,starts_at,ends_at,title,shareable,open_spots,group_level,private_notes,payment_status,reminder_minutes) values(a->>'kind',(a->>'starts_at')::timestamptz,(a->>'ends_at')::timestamptz,a->>'title',(a->>'shareable')::boolean,(a->>'open_spots')::int,a->>'group_level',coalesce(a->>'private_notes',''),coalesce(a->>'payment_status','unspecified'),(a->>'reminder_minutes')::int) returning id into bid;
 elsif c->>'operation'='update' then
  if a->>'kind'<>'lesson' and (exists(select 1 from public.enquiries where calendar_id=bid) or current_row->>'enquiry_id' is not null) then return jsonb_build_object('ok',false);end if;
  update public.calendar_blocks set kind=a->>'kind',starts_at=(a->>'starts_at')::timestamptz,ends_at=(a->>'ends_at')::timestamptz,title=a->>'title',shareable=(a->>'shareable')::boolean,open_spots=(a->>'open_spots')::int,group_level=a->>'group_level',private_notes=coalesce(a->>'private_notes',private_notes),payment_status=coalesce(a->>'payment_status',payment_status),reminder_minutes=(a->>'reminder_minutes')::int where id=bid;
 elsif c->>'operation'='delete' then
  -- Do not silently cancel an enquiry-linked booking or shared lesson with linked customers.
  if exists(select 1 from public.enquiries where calendar_id=bid) or current_row->>'enquiry_id' is not null then return jsonb_build_object('ok',false);end if;
  delete from public.calendar_blocks where id=bid;
 else return jsonb_build_object('ok',false);
 end if;
 update public.admin_proposals set applied_at=now(),result_id=bid where id=p.id;
 return jsonb_build_object('ok',true,'event_id',bid);
end $$;

alter table public.business_settings add column if not exists reminders_enabled boolean not null default false;
alter table public.business_settings add column if not exists default_reminder_minutes integer not null default 60 check(default_reminder_minutes in (30,60,120,1440));
alter table public.business_settings add column if not exists whatsapp_alerts boolean not null default false;
alter table public.business_settings add column if not exists daily_summary boolean not null default false;
create table if not exists public.notification_receipts(key text primary key, created_at timestamptz not null default now());
alter table public.notification_receipts enable row level security;
revoke all on public.notification_receipts from public,anon,authenticated;
grant select,insert,delete on public.notification_receipts to service_role;
-- Serialize email retries, rate limit per saved enquiry; the provider idempotency key is stable.
create or replace function public.claim_enquiry_email(p_id uuid) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 update public.enquiries set email_attempts=email_attempts+1,email_attempted_at=now(),email_state='pending'
 where id=p_id and channel='email' and email_state<>'accepted' and email_attempts<5
 and created_at>now()-interval '23 hours' and (email_attempted_at is null or email_attempted_at<now()-interval '15 seconds');
 return found;
end $$;
revoke all on function public.claim_enquiry_email(uuid) from public,anon,authenticated;
grant execute on function public.claim_enquiry_email(uuid) to service_role;
commit;
