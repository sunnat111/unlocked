import { notFound } from 'next/navigation';
import { I18nProvider } from '@/components/I18nProvider';
import { getDict, isLocale, locales } from '@/lib/i18n';

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Sets <html lang> before paint for crawlers that do not run effects.
  const setLang = `document.documentElement.lang=${JSON.stringify(locale)}`;
  return (
    <I18nProvider locale={locale} dict={getDict(locale)}>
      <script dangerouslySetInnerHTML={{ __html: setLang }} />
      {children}
    </I18nProvider>
  );
}
