#!/usr/bin/env bash
# Runs schema + seed + security tests against a throwaway local PostgreSQL database.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres bash supabase/tests/run.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=unlocked_test_$$
psql -q -v ON_ERROR_STOP=1 -d postgres -c "create database $DB"
trap 'psql -q -d postgres -c "drop database if exists $DB" >/dev/null; psql -q -d postgres -c "drop role if exists anon; drop role if exists authenticated" >/dev/null 2>&1 || true' EXIT
P="psql -q -v ON_ERROR_STOP=1 -d $DB"
$P -c "do \$\$ begin create role anon nologin; exception when duplicate_object then null; end \$\$;" \
   -c "do \$\$ begin create role authenticated nologin; exception when duplicate_object then null; end \$\$;"
sed '/^create role/d' tests/00_stub_supabase_auth.sql | $P
$P -f schema.sql 2>/dev/null
$P -f seed.sql
$P -c "insert into public.admins (user_id) select id from auth.users where email='admin@test.uz';"
out=$($P -f tests/10_security_test.sql 2>&1 | grep -oE '(PASS|FAIL).*')
echo "$out"
! grep -q FAIL <<<"$out"
