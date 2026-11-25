-- Run once in a new Supabase project. Keep the service-role key server-side.
create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 locale text not null check(locale in ('en','es','fr')), service integer not null check(service between 0 and 6),
 name text not null, phone text not null, preferred_date date, preferred_time text not null default '', duration text not null default '', group_size text not null default '', experience text not null default '', notes text not null default '',
 state text not null default 'new' check(state in ('new','replied','confirmed','closed')));
create table if not exists public.calendar_blocks (
 id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('lesson','rest','travel','off')),
 starts_at timestamptz not null, ends_at timestamptz not null check(ends_at>starts_at), title text not null default '', enquiry_id uuid references public.enquiries(id) on delete set null);
create index if not exists block_times on public.calendar_blocks(starts_at,ends_at);
create table if not exists public.operating_hours(id integer primary key check(id=1), start_time time not null, end_time time not null check(end_time>start_time),days integer[] not null, configured boolean not null default false);
create table if not exists public.enquiry_rate(id bigint generated always as identity primary key, fingerprint text not null, created_at timestamptz not null default now());
create index if not exists enquiry_rate_idx on public.enquiry_rate(fingerprint,created_at);
alter table public.enquiries enable row level security;
alter table public.calendar_blocks enable row level security;
alter table public.operating_hours enable row level security;
alter table public.enquiry_rate enable row level security;
revoke all on public.enquiries,public.calendar_blocks,public.operating_hours,public.enquiry_rate from anon,authenticated;
grant all on public.enquiries,public.calendar_blocks,public.operating_hours,public.enquiry_rate to service_role;
grant usage,select on sequence public.enquiry_rate_id_seq to service_role;
create or replace function public.submit_enquiry(p_payload jsonb,p_fingerprint text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare new_id uuid;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_fingerprint,0));
 delete from public.enquiry_rate where created_at < now()-interval '1 day';
 if (select count(*) from public.enquiry_rate where fingerprint=p_fingerprint and created_at>now()-interval '10 minutes') >= 5 then return null; end if;
 insert into public.enquiry_rate(fingerprint) values(p_fingerprint);
 insert into public.enquiries(locale,service,name,phone,preferred_date,preferred_time,duration,group_size,experience,notes) values(p_payload->>'locale',(p_payload->>'service')::int,p_payload->>'name',p_payload->>'phone',(p_payload->>'preferred_date')::date,p_payload->>'preferred_time',p_payload->>'duration',p_payload->>'group_size',p_payload->>'experience',p_payload->>'notes') returning id into new_id;
 return jsonb_build_object('id',new_id);
end $$;
revoke all on function public.submit_enquiry(jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_enquiry(jsonb,text) to service_role;
