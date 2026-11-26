-- Unlocked SAT — PostgreSQL schema (Supabase)
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste this file → Run.
-- Safe to re-run: it only creates what does not exist yet and replaces policies/functions.

-- ───────── Admins ─────────
-- People allowed to create, edit and delete questions. Add yourself after signing up:
--   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ───────── Questions ─────────
create table if not exists public.questions (
  id          text primary key default ('q' || substr(md5(gen_random_uuid()::text), 1, 10)),
  section     text not null check (section in ('rw', 'math')),
  skill       text not null,
  difficulty  smallint not null check (difficulty between 1 and 3),
  passage     text,
  prompt      text not null check (length(trim(prompt)) > 0),
  -- Multiple choice: exactly 4 options + index of the correct one (0 = A … 3 = D)
  choices     jsonb,
  answer      smallint,
  -- Student-produced response (no options): accepted numeric values, e.g. {0.75}
  accept      numeric[],
  explanation text not null default '',
  status      text not null default 'draft' check (status in ('draft', 'published')),
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint questions_skill_matches_section check (
    (section = 'rw' and skill in ('central-ideas', 'command-of-evidence', 'inferences', 'words-in-context',
      'text-structure', 'transitions', 'rhetorical-synthesis', 'boundaries', 'form-structure-sense'))
    or
    (section = 'math' and skill in ('linear-equations', 'linear-functions', 'linear-inequalities', 'systems',
      'equivalent-expressions', 'nonlinear-equations', 'nonlinear-functions', 'ratios', 'statistics',
      'probability', 'area-volume', 'lines-angles-triangles', 'right-triangles-trig', 'circles'))
  ),
  constraint questions_answer_shape check (
    (choices is not null
      and jsonb_typeof(choices) = 'array'
      and jsonb_array_length(choices) = 4
      and answer between 0 and 3
      and accept is null)
    or
    (choices is null
      and answer is null
      and accept is not null
      and cardinality(accept) between 1 and 5)
  )
);

create index if not exists questions_section_skill_idx on public.questions (section, skill);
create index if not exists questions_status_idx on public.questions (status);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists questions_touch on public.questions;
create trigger questions_touch
  before update on public.questions
  for each row execute function public.touch_updated_at();

-- ───────── Row-level security ─────────
alter table public.questions enable row level security;
alter table public.admins enable row level security;

-- Everyone (including visitors who are not signed in) can read published questions.
-- Admins can also read drafts.
drop policy if exists "questions: read published" on public.questions;
create policy "questions: read published" on public.questions
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists "questions: admins insert" on public.questions;
create policy "questions: admins insert" on public.questions
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "questions: admins update" on public.questions;
create policy "questions: admins update" on public.questions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "questions: admins delete" on public.questions;
create policy "questions: admins delete" on public.questions
  for delete to authenticated
  using (public.is_admin());

-- A signed-in user may only see whether they themselves are an admin.
drop policy if exists "admins: read own row" on public.admins;
create policy "admins: read own row" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- Table privileges (Supabase grants most of these by default; stated here explicitly).
grant usage on schema public to anon, authenticated;
grant select on public.questions to anon, authenticated;
grant insert, update, delete on public.questions to authenticated;
grant select on public.admins to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
