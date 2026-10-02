-- ============================================================================
-- CYSCOM ALUMNI MEETUP — Supabase schema for event registrations
-- ----------------------------------------------------------------------------
-- HOW TO RUN:
--   Supabase Dashboard -> SQL Editor -> New query -> paste this file -> Run
-- ============================================================================

-- 1. The registrations table -------------------------------------------------
create table if not exists public.registrations (
  id                 uuid primary key default gen_random_uuid(),
  -- Linked to the authenticated user (auth.users.id). Enforced by RLS below.
  user_id            uuid not null references auth.users (id) on delete cascade,
  full_name          text        not null,
  email              text        not null,
  phone              text        not null,
  graduation_year    text        not null,   -- e.g. '2018' (text so formats like '2018/2' also work)
  degree_department  text        not null,   -- e.g. 'B.Sc. Computer Science'
  company            text,                   -- current company / organization (optional)
  job_title          text,                   -- current job title (optional)
  notes              text,                   -- free-form comments (optional)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- One registration per user; re-submitting updates the existing row.
create unique index if not exists registrations_user_id_key
  on public.registrations (user_id);

-- 2. Keep updated_at fresh ----------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
  before update on public.registrations
  for each row execute function public.set_updated_at();

-- 3. Row Level Security --------------------------------------------------------
alter table public.registrations enable row level security;

-- INSERT: a user can only create a registration whose user_id is THEIR OWN id.
drop policy if exists "Users can insert their own registration" on public.registrations;
create policy "Users can insert their own registration"
  on public.registrations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE: a user can only modify their own registration.
drop policy if exists "Users can update their own registration" on public.registrations;
create policy "Users can update their own registration"
  on public.registrations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- SELECT: a user can view their own registration (lets the form restore state).
drop policy if exists "Users can view their own registration" on public.registrations;
create policy "Users can view their own registration"
  on public.registrations
  for select
  to authenticated
  using (auth.uid() = user_id);

-- NOTE FOR ORGANIZERS:
-- Anonymous users CANNOT see any rows (no policy grants them access).
-- Organizers should view/export data directly from the Supabase Dashboard
-- (Table Editor), which bypasses RLS. If you later want an in-app admin
-- dashboard, add a separate policy guarded by an `is_admin()` helper.
