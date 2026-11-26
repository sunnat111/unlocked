# Unlocked SAT

Adaptive Digital SAT preparation for students in Uzbekistan and Central Asia — **Uzbek, Russian and English**.

> *Your score, unlocked.*

This repository is the **MVP**: a marketing website plus a working practice app. It runs fully in the browser, with no backend yet, and is exported as static files, so it can be hosted anywhere.

## What's inside

### Website (`/uz`, `/ru`, `/en`)
| Page | Path |
| --- | --- |
| Homepage (9 sections: hero, problem, three keys with live demos, method, score simulator, pricing, FAQ, CTA, footer) | `/{locale}/` |
| SAT score calculator (SEO tool) | `/{locale}/score-calculator/` |
| SAT dates 2026–27 with countdown (SEO tool) | `/{locale}/sat-dates/` |
| Terms / Privacy (draft text) | `/{locale}/terms/`, `/{locale}/privacy/` |
| Branded 404, `sitemap.xml`, `robots.txt`, Open Graph image, JSON-LD (Organization, FAQPage, Product) | — |

### Practice app (`/{locale}/app/`)
- **Onboarding**: name, target score, official SAT date.
- **Dashboard**: countdown, latest estimate vs target, *today's focus*, weekly plan, weakest skills, stats and streak.
- **Adaptive diagnostic** (Bluebook-style): 2 sections × 2 modules. Module 1 routes you to an easier or harder Module 2. It includes a timer, mark for review, an answer eliminator, a question navigator, a review page, a built-in calculator (Math), and resume after reload.
- **Results**: estimated total and section scores as ranges, accuracy by skill, full answer review with explanations.
- **Practice**: filter by section, skill and difficulty, with instant feedback and explanations.
- **Mistake journal**: every wrong answer is saved. Tag the error type, retry it until it's "unlocked", or drill the skill.
- **Progress**: score history chart, skill accuracy, data export and reset.

Progress is stored in `localStorage` (`src/lib/store.ts`). The store is shaped so it can be replaced by API calls when accounts arrive.

### Content
- 56 **original** SAT-style questions (28 Reading & Writing, 28 Math) in `src/data/questions.ts`, tagged by official domain and skill (`src/data/skills.ts`) and by difficulty 1–3. They are not College Board material.
- The diagnostic definition is in `src/data/tests.ts`.

## Design
The editorial system from the reference analysis (huge uppercase display type, numbered section eyebrows, square 1px-bordered cards, pill buttons, slow expo-out motion, dark/light alternating sections), recoloured from the logo:

| Token | Value |
| --- | --- |
| Brand navy | `#2C4271` |
| Brand gold | `#D5A13C` |
| Night (dark sections) | `#0C1529` |
| Paper (light sections) | `#F4F4F2` |
| Font | Inter (self-hosted via `@fontsource-variable/inter`) |

All tokens are in `src/styles/tokens.css`. The website and the app share one system.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # content + logic checks (question bank, calculator, diagnostic)
npm run typecheck
NEXT_PUBLIC_SITE_URL=https://your-domain npm run build   # static site in ./out
npm run preview      # serve ./out on http://localhost:4000
```

Requires Node 22+.

## Deploy
`npm run build` produces a static site in `out/`. Upload it to any static host: Vercel, Netlify, Cloudflare Pages, GitHub Pages or nginx. Set `NEXT_PUBLIC_SITE_URL` at build time so canonical URLs, hreflang, the sitemap and Open Graph tags point to the real domain. Configure the host to serve `404.html` for unknown paths.

## Before launch — replace placeholders
All business settings are in **`src/lib/config.ts`**:
- Telegram link and handle, email, phone (`site`)
- Premium prices in so'm (`pricing`)
- SAT dates (`satDates`): verify each year at satsuite.collegeboard.org

Also:
- Legal text in `src/data/legal.ts` is a **draft**. Have it reviewed by a lawyer.
- Have native speakers proofread `src/i18n/uz.ts` and `src/i18n/ru.ts`.

## Project structure
```
src/
  app/                    Next.js App Router (static export)
    [locale]/             uz | ru | en
      page.tsx            homepage
      score-calculator/ sat-dates/ terms/ privacy/
      app/                practice app: dashboard, test, results, practice, mistakes, progress
    sitemap.ts robots.ts not-found.tsx icon.svg
  components/site/        Header (with mobile drawer), Footer, HeroGlow, demos, simulator, pricing…
  components/app/         AppShell, TestRunner, QuestionView, Calculator, Dashboard…
  data/                   questions, skills, diagnostic, legal text
  i18n/                   en.ts (source of truth for keys), uz.ts, ru.ts
  lib/                    config, i18n, store, scoring, calc, dates, seo
  styles/                 tokens.css, globals.css, site.css, app.css
scripts/check.mts         npm test
```

## Roadmap (next phases)
1. **Accounts and sync**: phone OTP and Telegram login, with progress saved on a server (NestJS + PostgreSQL per the blueprint).
2. **Payments**: Payme and Click (UZS) for Premium.
3. **More content**: a larger question bank and full-length 98-question adaptive mock tests.
4. **Telegram bot**: daily reminders and parent progress reports.
5. **Teacher / school dashboard**: classes, assignments, group reports.
6. **Analytics**: loaded only after cookie consent.

---
SAT® is a registered trademark of the College Board, which is not affiliated with and does not endorse Unlocked SAT.
