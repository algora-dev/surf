-- Dedicated Península database only. Apply after schema.sql and upgrade-v11.sql.
begin;
create table if not exists public.admin_proposals (
 id uuid primary key, owner_id uuid not null, created_at timestamptz not null default now(),
 expires_at timestamptz not null, change jsonb not null, applied_at timestamptz, result_id uuid
);
alter table public.admin_proposals enable row level security;
revoke all on public.admin_proposals from public,anon,authenticated;
grant all on public.admin_proposals to service_role;
create table if not exists public.owner_assistant_usage (created_at timestamptz not null default now());
alter table public.owner_assistant_usage enable row level security;
revoke all on public.owner_assistant_usage from public,anon,authenticated;
grant all on public.owner_assistant_usage to service_role;
create or replace function public.allow_owner_assistant() returns boolean language plpgsql security invoker set search_path='' as $$
begin
 perform pg_advisory_xact_lock(187385812);
 delete from public.owner_assistant_usage where created_at<now()-interval '1 day';
 delete from public.admin_proposals where expires_at<now()-interval '1 day';
 if (select count(*) from public.owner_assistant_usage)>=100 then return false;end if;
 insert into public.owner_assistant_usage default values;return true;
end $$;
-- The model cannot call this function. Only an authenticated explicit confirmation request can.
create or replace function public.apply_admin_proposal(p_id uuid,p_owner uuid) returns jsonb language plpgsql security invoker set search_path='' as $$
declare p public.admin_proposals%rowtype; c jsonb; a jsonb; prior jsonb; current_row jsonb; overlaps jsonb; bid uuid;
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
  select coalesce(jsonb_agg(to_jsonb(b) order by b.id),'[]'::jsonb) into overlaps from public.calendar_blocks b where (bid is null or b.id<>bid) and b.starts_at<(a->>'ends_at')::timestamptz and b.ends_at>(a->>'starts_at')::timestamptz;
  if overlaps is distinct from (select coalesce(jsonb_agg(to_jsonb(jsonb_populate_record(null::public.calendar_blocks,x)) order by x->>'id'),'[]'::jsonb) from jsonb_array_elements(c->'overlaps') as j(x)) then return jsonb_build_object('ok',false);end if;
 end if;
 if c->>'operation'='create' then
  insert into public.calendar_blocks(kind,starts_at,ends_at,title,shareable,open_spots,group_level) values(a->>'kind',(a->>'starts_at')::timestamptz,(a->>'ends_at')::timestamptz,a->>'title',(a->>'shareable')::boolean,(a->>'open_spots')::int,a->>'group_level') returning id into bid;
 elsif c->>'operation'='update' then
  if a->>'kind'<>'lesson' and (exists(select 1 from public.enquiries where calendar_id=bid) or current_row->>'enquiry_id' is not null) then return jsonb_build_object('ok',false);end if;
  update public.calendar_blocks set kind=a->>'kind',starts_at=(a->>'starts_at')::timestamptz,ends_at=(a->>'ends_at')::timestamptz,title=a->>'title',shareable=(a->>'shareable')::boolean,open_spots=(a->>'open_spots')::int,group_level=a->>'group_level' where id=bid;
 elsif c->>'operation'='delete' then
  -- Do not silently cancel an enquiry-linked booking or shared lesson with linked customers.
  if exists(select 1 from public.enquiries where calendar_id=bid) or current_row->>'enquiry_id' is not null then return jsonb_build_object('ok',false);end if;
  delete from public.calendar_blocks where id=bid;
 else return jsonb_build_object('ok',false);
 end if;
 update public.admin_proposals set applied_at=now(),result_id=bid where id=p.id;
 return jsonb_build_object('ok',true,'event_id',bid);
end $$;
revoke all on function public.allow_owner_assistant(),public.apply_admin_proposal(uuid,uuid) from public,anon,authenticated;
grant execute on function public.allow_owner_assistant(),public.apply_admin_proposal(uuid,uuid) to service_role;
commit;
