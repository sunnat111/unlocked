import type { Metadata } from 'next';
import { PageShell } from '@/components/site/PageShell';
import { DateList } from '@/components/site/DateList';
import { getDict, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale).dates;
  return pageMeta(locale, 'sat-dates', d.metaTitle, d.metaDesc);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const d = getDict(locale).dates;
  return (
    <PageShell eyebrow={d.eyebrow} title={d.title} intro={d.intro}>
      <DateList />
      <p className="notice">{d.note}</p>
    </PageShell>
  );
}
