import Link from 'next/link';
import type { Metadata } from 'next';
import { PageShell } from '@/components/site/PageShell';
import { ScoreCalculator } from '@/components/site/ScoreCalculator';
import { getDict, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getDict(locale).calc;
  return pageMeta(locale, 'score-calculator', c.metaTitle, c.metaDesc);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const c = getDict(locale).calc;
  return (
    <PageShell eyebrow={c.eyebrow} title={c.title} intro={c.intro}>
      <ScoreCalculator />
      <p className="notice">{c.disclaimer}</p>
      <article className="prose">
        <h2>{c.howTitle}</h2>
        <ul>{c.how.map((x) => <li key={x}>{x}</li>)}</ul>
      </article>
      <div>
        <Link href={`/${locale}/app/test/`} className="btn btn-ink btn-lg">{c.cta} <span className="arrow" aria-hidden>→</span></Link>
      </div>
    </PageShell>
  );
}
