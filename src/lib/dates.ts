// Locale-stable date formatting (identical on server and in every browser → no hydration mismatch).
import type { Locale } from './i18n';

const months: Record<Locale, { long: string[]; short: string[] }> = {
  en: {
    long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  uz: {
    long: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    short: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
  },
  ru: {
    long: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    short: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  },
};

/** iso: 'YYYY-MM-DD' or epoch ms. */
export function formatDate(input: string | number, locale: Locale, opts: { short?: boolean; year?: boolean } = {}) {
  const { short = false, year = true } = opts;
  let y: number, m: number, d: number;
  if (typeof input === 'string') [y, m, d] = input.slice(0, 10).split('-').map(Number);
  else {
    const dt = new Date(input);
    y = dt.getFullYear(); m = dt.getMonth() + 1; d = dt.getDate();
  }
  const name = months[locale][short ? 'short' : 'long'][m - 1];
  if (locale === 'en') return year ? `${name} ${d}, ${y}` : `${name} ${d}`;
  if (locale === 'ru') return year ? `${d} ${name} ${y}` : `${d} ${name}`;
  return year ? `${y}-yil ${d}-${name}` : `${d}-${name}`;
}
