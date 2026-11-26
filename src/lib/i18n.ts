import en, { type Dict } from '@/i18n/en';
import uz from '@/i18n/uz';
import ru from '@/i18n/ru';

export const locales = ['uz', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'uz';
export const localeLabels: Record<Locale, string> = { uz: 'UZ', ru: 'RU', en: 'EN' };
export const localeNames: Record<Locale, string> = { uz: 'O‘zbekcha', ru: 'Русский', en: 'English' };
export const htmlLang: Record<Locale, string> = { uz: 'uz', ru: 'ru', en: 'en' };
export const ogLocale: Record<Locale, string> = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };

const dicts: Record<Locale, Dict> = { en, uz, ru };

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

export function getDict(locale: string): Dict {
  return dicts[isLocale(locale) ? locale : defaultLocale];
}

/** Replace {key} placeholders. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export type { Dict };
