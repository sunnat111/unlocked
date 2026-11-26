\set QUIET 1
\pset tuples_only on
-- helper: run as a role with given user id
create or replace function pg_temp.expect(label text, ok boolean) returns void language plpgsql as $$
begin raise notice '% %', case when ok then 'PASS' else 'FAIL' end, label; end $$;

-- Admin creates a draft
begin;
set local role authenticated; select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
insert into public.questions (id, section, skill, difficulty, prompt, choices, answer, explanation) values ('draft1','math','linear-equations',1,'Draft?','["1","2","3","4"]',0,'x');
select pg_temp.expect('admin can insert draft', (select count(*) from public.questions where id='draft1') = 1);
update public.questions set prompt='Edited' where id='rw01';
select pg_temp.expect('admin can update', (select prompt from public.questions where id='rw01') = 'Edited');
select pg_temp.expect('admin sees own admin row', (select count(*) from public.admins) = 1);
commit;

-- Anonymous visitor
begin;
set local role anon; select set_config('request.jwt.claims', '{"role":"anon"}', true);
select pg_temp.expect('anon reads 56 published', (select count(*) from public.questions) = 56);
select pg_temp.expect('anon cannot see draft', (select count(*) from public.questions where id='draft1') = 0);
commit;
do $$ begin
  set local role anon;
  begin insert into public.questions (section, skill, difficulty, prompt, choices, answer) values ('rw','inferences',1,'x','["a","b","c","d"]',0);
    raise notice 'FAIL anon insert blocked';
  exception when others then raise notice 'PASS anon insert blocked (%)', sqlerrm; end;
end $$;

-- Signed-in student (not admin)
begin;
set local role authenticated; select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
select pg_temp.expect('student reads published only', (select count(*) from public.questions) = 56);
update public.questions set prompt='HACK' where id='rw02';
delete from public.questions where id='rw03';
select pg_temp.expect('student admin row hidden', (select count(*) from public.admins) = 0);
commit;
select pg_temp.expect('student update had no effect', (select prompt from public.questions where id='rw02') <> 'HACK');
select pg_temp.expect('student delete had no effect', (select count(*) from public.questions where id='rw03') = 1);
do $$ begin
  set local role authenticated;
  perform set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222"}', true);
  begin insert into public.questions (section, skill, difficulty, prompt, choices, answer) values ('rw','inferences',1,'x','["a","b","c","d"]',0);
    raise notice 'FAIL student insert blocked';
  exception when others then raise notice 'PASS student insert blocked (%)', sqlerrm; end;
end $$;

-- Data validation constraints (as admin)
do $$ begin
  set local role authenticated;
  perform set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111"}', true);
  begin insert into public.questions (section, skill, difficulty, prompt, choices, answer) values ('rw','inferences',1,'x','["a","b","c"]',0); raise notice 'FAIL 3 choices rejected';
  exception when check_violation then raise notice 'PASS 3 choices rejected'; end;
  begin insert into public.questions (section, skill, difficulty, prompt, choices, answer) values ('rw','linear-equations',1,'x','["a","b","c","d"]',0); raise notice 'FAIL wrong skill rejected';
  exception when check_violation then raise notice 'PASS skill/section mismatch rejected'; end;
  begin insert into public.questions (section, skill, difficulty, prompt) values ('math','systems',2,'x'); raise notice 'FAIL missing answer rejected';
  exception when check_violation then raise notice 'PASS missing answer rejected'; end;
  begin insert into public.questions (section, skill, difficulty, prompt, accept) values ('math','systems',2,'grid', array[0.75]);
    raise notice 'PASS grid-in question accepted with generated id %', (select id from public.questions where prompt='grid');
  exception when others then raise notice 'FAIL grid-in insert: %', sqlerrm; end;
end $$;

-- Admin delete + updated_at trigger
begin;
set local role authenticated; select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111"}', true);
delete from public.questions where id='draft1';
select pg_temp.expect('admin can delete', (select count(*) from public.questions where id='draft1') = 0);
select pg_temp.expect('updated_at trigger fired', (select updated_at > created_at from public.questions where id='rw01'));
commit;
