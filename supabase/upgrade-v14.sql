-- Dedicated Península project only. Apply once after upgrade-v12.sql.
-- This migration is repeatable and never overwrites a saved choice.
begin;
create table if not exists public.business_settings (
 id integer primary key check (id=1),
 enquiry_mode text not null default 'smart' check (enquiry_mode in ('smart','direct'))
);
alter table public.business_settings enable row level security;
revoke all on public.business_settings from public,anon,authenticated;
grant select,insert,update on public.business_settings to service_role;
insert into public.business_settings(id,enquiry_mode) values (1,'smart') on conflict (id) do nothing;
commit;
