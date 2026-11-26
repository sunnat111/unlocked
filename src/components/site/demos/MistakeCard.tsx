'use client';
import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';

export function MistakeCard() {
  const { locale, t } = useI18n();
  const c = t.keys.k2.card;
  return (
    <div className="demo">
      <div className="sample-card">
        <div className="sample-head">
          <span className="caption">{c.topic}</span>
          <span className="chip chip-alert">{c.chip}</span>
        </div>
        <p className="sample-q">{c.question}</p>
        <dl className="sample-rows">
          {c.rows.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.text}</dd>
            </div>
          ))}
        </dl>
        <Link href={`/${locale}/app/mistakes/`} className="btn btn-ink btn-block">
          {c.cta} <span className="arrow" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
