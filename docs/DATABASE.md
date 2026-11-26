# Database setup (PostgreSQL on Supabase)

Questions live in a **PostgreSQL** database, so everything you add or edit is stored permanently. Redeploying or changing the website never touches it. The website reads published questions from it, and you manage them in the admin panel at `/uz/admin/` (or `/ru/admin/`, `/en/admin/`).

While the database is not connected, the site keeps working with the 56 built-in questions.

**Time needed:** about 15 minutes, once.

---

## 1. Create the database (free)

1. Go to **https://supabase.com**, sign up, and click **New project**.
2. Name it `unlocked-sat`, choose a strong database password (save it somewhere safe), and pick a region close to your students, e.g. **Frankfurt (eu-central-1)**.
3. Wait about a minute until the project is ready.

## 2. Create the tables

1. In the project, open **SQL Editor → New query**.
2. Open the file [`supabase/schema.sql`](../supabase/schema.sql) from this repository, copy all of it, paste it and click **Run**. You should see "Success".
3. *(Optional)* Do the same with [`supabase/seed.sql`](../supabase/seed.sql) to load the 56 starter questions. You can also do this later with one button in the admin panel.

## 3. Create your admin account

1. Open **Authentication → Users → Add user → Create new user**.
2. Enter your email and a password, tick **Auto Confirm User**, and click **Create user**.
3. Back in **SQL Editor**, run this with your email:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

Only accounts listed in `admins` can create, edit or delete questions. Everyone else, including visitors who are not signed in, can only **read published** questions. This is enforced by the database itself (row-level security), not just by the website.

## 4. Connect the website

1. In Supabase open **Project Settings → API** (or **Data API**) and copy:
   - **Project URL**, e.g. `https://abcd1234.supabase.co`
   - the **anon / public** key (also called the **publishable** key). It is designed to be public, so it is safe in a website. **Never** use the `service_role` / secret key.
2. On GitHub open **sunnat111/unlocked → Settings → Secrets and variables → Actions → Variables tab → New repository variable**, and add two variables:

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | your Project URL |
   | `SUPABASE_ANON_KEY` | your anon / publishable key |

3. Redeploy: **Actions → Deploy to GitHub Pages → Run workflow** (or just push any change).

## 5. Add questions

Open `https://sunnat111.github.io/unlocked/uz/admin/` and sign in with the account from step 3.

- **+ New question**: choose section, skill and difficulty, write the passage and question, then enter four choices and mark the correct one, or enter numeric answers for student-produced Math questions. The preview on the right shows exactly what students will see.
- **Save & publish** makes the question visible to students. **Save as draft** keeps it hidden until it is ready.
- Click any row to edit or delete it.
- **Export JSON** downloads every question (a backup). **Import JSON** uploads a file in the same format: new questions are added, and existing ids are updated.

Students get new questions the next time they open the app. No redeploy is needed.

---

## Backups and moving to your own server later

Your data does not depend on this website or on Supabase:

- **Quick backup:** admin panel → **Export JSON**. Keep the file somewhere safe. Import it into any future version of the site.
- **Full PostgreSQL backup:** Supabase → **Project Settings → Database → Connection string**, then on any computer with PostgreSQL tools:

  ```bash
  pg_dump "postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres" \
    --data-only --table=public.questions --column-inserts > questions.sql
  ```

- **Moving to your own PostgreSQL server:** create the same `questions` table there (the column list is in `supabase/schema.sql`) and run `psql -d yourdb -f questions.sql`. This export/import round trip was tested and produces identical data.

Supabase also makes automatic daily backups on paid plans.

## Testing the schema locally (developers)

With a local PostgreSQL 14+:

```bash
PGHOST=localhost PGUSER=postgres bash supabase/tests/run.sh
```

It creates a throwaway database, applies the schema and seed, and checks the security rules: visitors and students cannot write, admins can, drafts stay hidden, and bad data is rejected.
