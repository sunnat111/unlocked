import type { Metadata } from 'next';
import { PageShell } from '@/components/site/PageShell';
import { terms as docs, LEGAL_UPDATED } from '@/data/legal';
import { fmt, getDict, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = docs[locale];
  return pageMeta(locale, 'terms', doc.title, doc.sections[0].p);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = getDict(locale);
  const doc = docs[locale];
  return (
    <PageShell eyebrow={fmt(t.legal.updated, { d: LEGAL_UPDATED })} title={doc.title}>
      <p className="notice">{t.legal.draft}</p>
      <article className="prose">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
      </article>
    </PageShell>
  );
}
