import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { locales } from '@/lib/i18n';

export const dynamic = 'force-static';

const paths = ['', 'score-calculator', 'sat-dates', 'terms', 'privacy'];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((p) =>
    locales.map((l) => ({
      url: `${SITE_URL}/${l}/${p ? p + '/' : ''}`,
      changeFrequency: p ? 'monthly' : 'weekly',
      priority: p ? 0.6 : 1,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${SITE_URL}/${x}/${p ? p + '/' : ''}`])) },
    })),
  );
}
