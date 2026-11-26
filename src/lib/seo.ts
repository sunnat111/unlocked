import type { Metadata } from 'next';
import { SITE_URL } from './config';
import { locales, ogLocale, type Locale } from './i18n';

/** Build metadata with canonical + hreflang alternates for a locale-prefixed path ('' for home). */
export function pageMeta(locale: Locale, path: string, title: string, description: string): Metadata {
  const p = path ? `/${path.replace(/^\/|\/$/g, '')}/` : '/';
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${p}`;
  languages['x-default'] = `${SITE_URL}/uz${p}`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}${p}`, languages },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${p}`,
      siteName: 'Unlocked SAT',
      locale: ogLocale[locale],
      type: 'website',
      images: [{ url: `${SITE_URL}/brand/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/brand/og-image.png`] },
  };
}
