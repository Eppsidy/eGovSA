-- Safe migration to align `profiles` table with the app schema
-- Run this in Supabase SQL editor

-- 1) Ensure table exists and has correct PK and FK
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

-- 2) Add columns if missing
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists pin text;
alter table public.profiles add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;
alter table public.profiles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- 3) Make full_name optional (covers OTP flows that don’t provide a name)
alter table public.profiles alter column full_name drop not null;

-- 4) Upsert-friendly indexes
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_phone_idx on public.profiles (phone);

-- 5) Ensure updated_at auto-updates on changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- 6) Ensure RLS and policies are in place
alter table public.profiles enable row level security;

-- Remove existing policies with these names to avoid duplicates
do $$
begin
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can view own profile') then
    drop policy "Users can view own profile" on public.profiles;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert own profile') then
    drop policy "Users can insert own profile" on public.profiles;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile') then
    drop policy "Users can update own profile" on public.profiles;
  end if;
end $$;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to anon, authenticated;

-- 7) Helper function: email_exists for login pre-checks (SECURITY DEFINER to bypass RLS safely)
create or replace function public.email_exists(p_email text)
returns boolean
language plpgsql
security definer
as $$
declare
  exists_bool boolean;
begin
  select exists (
    select 1 from public.profiles where lower(email) = lower(p_email) limit 1
  ) into exists_bool;
  return exists_bool;
end;
$$;

revoke all on function public.email_exists(text) from public;
grant execute on function public.email_exists(text) to anon, authenticated;

-- 7b) Helper function: verify_pin checks if hashed PIN matches for the email
create or replace function public.verify_pin(p_email text, p_pin_hash text)
returns boolean
language plpgsql
security definer
as $$
declare
  is_match boolean;
begin
  select exists (
    select 1 from public.profiles
    where lower(email) = lower(p_email)
      and pin = p_pin_hash
    limit 1
  ) into is_match;
  return is_match;
end;
$$;

revoke all on function public.verify_pin(text, text) from public;
grant execute on function public.verify_pin(text, text) to anon, authenticated;

-- 7) Optional: backfill full_name from first/last where empty
update public.profiles
set full_name = coalesce(full_name, trim(concat_ws(' ', first_name, last_name)))
where full_name is null or full_name = '';

-- 8) Inspect columns (run as a separate query if you want to verify)
-- select column_name, is_nullable, data_type
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'profiles'
-- order by ordinal_position;