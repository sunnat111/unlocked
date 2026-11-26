-- Minimal stand-in for Supabase's auth schema + API roles (same auth.uid() definition Supabase uses)
create role anon nologin; create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(coalesce(current_setting('request.jwt.claim.sub', true), (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')), '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
insert into auth.users values ('11111111-1111-1111-1111-111111111111','admin@test.uz'), ('22222222-2222-2222-2222-222222222222','student@test.uz');
