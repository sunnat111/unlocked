'use client';
import { createContext, useContext, useEffect } from 'react';
import type { Dict } from '@/i18n/en';
import type { Locale } from '@/lib/i18n';

const Ctx = createContext<{ locale: Locale; t: Dict } | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    try { localStorage.setItem('unlocked.locale', locale); } catch {}
  }, [locale]);
  return <Ctx.Provider value={{ locale, t: dict }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n outside provider');
  return v;
}
