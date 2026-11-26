import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { HeroGlow } from '@/components/site/HeroGlow';
import { ScrollBadge } from '@/components/site/ScrollBadge';
import { Reveal } from '@/components/site/Reveal';
import { RoutingDemo } from '@/components/site/demos/RoutingDemo';
import { MistakeCard } from '@/components/site/demos/MistakeCard';
import { PlanCard } from '@/components/site/demos/PlanCard';
import { ScoreSimulator } from '@/components/site/ScoreSimulator';
import { Pricing } from '@/components/site/Pricing';
import { getDict, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { SITE_URL, site, pricing } from '@/lib/config';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale);
  return { ...pageMeta(locale, '', t.meta.title, t.meta.description), title: { absolute: t.meta.title } };
}

function Eyebrow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <b>{String(n).padStart(2, '0')}</b> / {children}
    </p>
  );
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.name,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/logo-mark.svg`,
      email: site.email,
      sameAs: [site.telegram],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: t.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${site.name} Premium`,
      description: t.pricing.premium.desc,
      brand: site.name,
      offers: { '@type': 'Offer', price: pricing.premiumMonthly, priceCurrency: 'UZS', url: `${SITE_URL}/${locale}/#pricing` },
    },
  ];

  const keys = [
    { id: 'routing', k: t.keys.k1, demo: <RoutingDemo /> },
    { id: 'mistake-journal', k: t.keys.k2, demo: <MistakeCard /> },
    { id: 'plan', k: t.keys.k3, demo: <PlanCard /> },
  ];

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">
        {/* 00 — Hero */}
        <section className="hero tone-dark" id="top">
          <HeroGlow />
          <div className="shell hero-inner">
            <p className="hero-pill">{t.hero.eyebrow}</p>
            <h1 className="display">
              {t.hero.title.map((l, i) => (
                <span key={i} className={i === t.hero.title.length - 1 ? 'gold' : undefined}>{l}</span>
              ))}
            </h1>
            <p className="hero-lead">{t.hero.lead}</p>
            <div className="hero-actions">
              <Link href={`/${locale}/app/test/`} className="btn btn-gold btn-lg">
                {t.hero.cta1} <span className="arrow" aria-hidden>→</span>
              </Link>
              <a href="#problem" className="btn btn-ghost-dark btn-lg">
                {t.hero.cta2} <span aria-hidden>↓</span>
              </a>
            </div>
            <ul className="ticks">
              {t.hero.ticks.map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
          </div>
          <ScrollBadge text={t.hero.scroll} />
        </section>

        {/* 01 — Problem */}
        <section className="section tone-paper" id="problem">
          <div className="shell">
            <Eyebrow n={1}>{t.problem.eyebrow}</Eyebrow>
            <Reveal as="h2" className="h2">
              <span>{t.problem.title[0]}</span>
              <span className="muted">{t.problem.title[1]}</span>
            </Reveal>
            <div className="problem-text">
              <p className="lead problem-p1">{t.problem.p1}</p>
              <p className="lead muted">{t.problem.p2}</p>
            </div>
            <div className="stats">
              {t.problem.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <p className="caption">{s.label}</p>
                  <p className="stat-value">{s.value}</p>
                  <p className="stat-note">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 02 — Three keys */}
        <section className="section tone-white" id="keys">
          <div className="shell">
            <Eyebrow n={2}>{t.keys.eyebrow}</Eyebrow>
            <Reveal as="h2" className="h2 keys-title">{t.keys.title}</Reveal>
            {keys.map(({ id, k, demo }, i) => (
              <article className="feature" id={id} key={id}>
                <header className="feature-head">
                  <p className="caption"><b className="gold">{String(i + 1).padStart(2, '0')}</b> / {k.tag}</p>
                  <h3 className="feature-title">{k.title}</h3>
                  <p className="caption">{k.sub}</p>
                </header>
                <div className="feature-body">
                  <p className="feature-text">{k.body}</p>
                  {demo}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 03 — Method */}
        <section className="section tone-dark method" id="method">
          <div className="shell">
            <Eyebrow n={3}>{t.method.eyebrow}</Eyebrow>
            <Reveal as="h2" className="h2-caps">
              {t.method.title.map((l, i) => (
                <span key={i} className={i === t.method.title.length - 1 ? 'gold' : undefined} style={{ display: 'block' }}>{l}</span>
              ))}
            </Reveal>
            <p className="lead muted method-body">{t.method.body}</p>
            <ol className="method-grid">
              {t.method.steps.map((s, i) => (
                <li className="method-step" key={s.title}>
                  <div className="method-step-top">
                    <span className="method-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="caption">{s.tag}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 04 — Simulator */}
        <section className="section tone-paper" id="simulator">
          <div className="shell">
            <Eyebrow n={4}>{t.sim.eyebrow}</Eyebrow>
            <Reveal as="h2" className="h2">{t.sim.title}</Reveal>
            <p className="lead muted section-intro">{t.sim.body}</p>
            <ScoreSimulator />
          </div>
        </section>

        {/* 05 — Pricing */}
        <section className="section tone-white" id="pricing">
          <div className="shell">
            <Eyebrow n={5}>{t.pricing.eyebrow}</Eyebrow>
            <Reveal as="h2" className="h2">
              <span>{t.pricing.title[0]}</span>
              <span className="muted">{t.pricing.title[1]}</span>
            </Reveal>
            <p className="lead muted section-intro">{t.pricing.body}</p>
            <Pricing />
          </div>
        </section>

        {/* 06 — FAQ */}
        <section className="section tone-paper" id="faq">
          <div className="shell faq-layout">
            <div>
              <Eyebrow n={6}>{t.faq.eyebrow}</Eyebrow>
              <Reveal as="h2" className="h2">{t.faq.title}</Reveal>
            </div>
            <div className="accordion">
              {t.faq.items.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="acc-icon" aria-hidden />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — Final CTA */}
        <section className="section tone-dark cta-band">
          <HeroGlow />
          <div className="shell cta-inner">
            <Eyebrow n={7}>{t.cta.eyebrow}</Eyebrow>
            <Reveal as="h2" className="h2">
              <span>{t.cta.title[0]}</span>
              <span className="gold">{t.cta.title[1]}</span>
            </Reveal>
            <p className="lead muted">{t.cta.body}</p>
            <Link href={`/${locale}/app/test/`} className="btn btn-gold btn-lg">
              {t.cta.button} <span className="arrow" aria-hidden>→</span>
            </Link>
            <p className="caption cta-trust">{t.cta.trust}</p>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
    </>
  );
}
