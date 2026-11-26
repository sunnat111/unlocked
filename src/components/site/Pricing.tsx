'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { fmt } from '@/lib/i18n';
import { formatSom, pricing, site } from '@/lib/config';

export function Pricing() {
  const { locale, t } = useI18n();
  const p = t.pricing;
  const [yearly, setYearly] = useState(true);
  const price = yearly ? pricing.premiumYearly : pricing.premiumMonthly;
  const usd = Math.round(price / pricing.usdRate);
  return (
    <>
      <div className="segmented" role="group">
        <button aria-pressed={!yearly} onClick={() => setYearly(false)}>{p.monthly}</button>
        <button aria-pressed={yearly} onClick={() => setYearly(true)}>
          {p.yearly}
          <small>{p.save}</small>
        </button>
      </div>
      <div className="price-grid">
        <article className="price-card">
          <h3 className="price-name">{p.free.name}</h3>
          <p className="price-amount">0 <span>{p.som} {p.forever}</span></p>
          <p className="price-desc">{p.free.desc}</p>
          <ul className="price-list">{p.free.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <Link href={`/${locale}/app/`} className="btn btn-ghost btn-block">{p.free.cta} <span className="arrow" aria-hidden>→</span></Link>
        </article>
        <article className="price-card is-featured">
          <div className="price-head">
            <h3 className="price-name">{p.premium.name}</h3>
            <span className="chip chip-gold">{p.premium.chip}</span>
          </div>
          <p className="price-amount">{formatSom(price)} <span>{p.som} {p.perMonth}</span></p>
          <p className="price-sub">{yearly ? p.billedYearly : p.billedMonthly} · {fmt(p.usd, { n: usd })}</p>
          <p className="price-desc">{p.premium.desc}</p>
          <ul className="price-list">{p.premium.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-block">{p.premium.cta} <span className="arrow" aria-hidden>→</span></a>
        </article>
        <article className="price-card">
          <div className="price-head">
            <h3 className="price-name">{p.school.name}</h3>
            <span className="chip">{p.school.chip}</span>
          </div>
          <p className="price-amount price-amount-text">{p.school.price} <span>{p.school.suffix}</span></p>
          <p className="price-desc">{p.school.desc}</p>
          <ul className="price-list">{p.school.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-block">{p.school.cta} <span className="arrow" aria-hidden>→</span></a>
        </article>
      </div>
    </>
  );
}
