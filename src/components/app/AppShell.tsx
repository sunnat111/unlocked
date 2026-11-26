'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from '@/components/Logo';
import { useI18n } from '@/components/I18nProvider';
import { localeLabels, locales } from '@/lib/i18n';

const icons: Record<string, string> = {
  dashboard: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  test: 'M9 3h6l1 3h3v15H5V6h3zm0 9l2 2 4-4',
  practice: 'M4 19V5m0 14h16M8 15l3-4 3 2 5-6',
  mistakes: 'M6 3h9l4 4v14H6zM9 12h6M9 16h4M14 3v5h5',
  progress: 'M4 20h16M7 16v-5m5 5V8m5 8V5',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || '';
  const base = `/${locale}/app`;
  if (/\/app\/test\/?$/.test(pathname)) return <>{children}</>;
  const items = [
    { key: 'dashboard', href: `${base}/`, label: t.app.nav.dashboard },
    { key: 'test', href: `${base}/test/`, label: t.app.nav.test },
    { key: 'practice', href: `${base}/practice/`, label: t.app.nav.practice },
    { key: 'mistakes', href: `${base}/mistakes/`, label: t.app.nav.mistakes },
    { key: 'progress', href: `${base}/progress/`, label: t.app.nav.progress },
  ];
  const isActive = (href: string) => (href === `${base}/` ? pathname === href || pathname === base : pathname.startsWith(href));
  const swap = (l: string) => pathname.replace(/^\/(uz|ru|en)(?=\/|$)/, `/${l}`);
  return (
    <div className="app">
      <header className="app-bar">
        <div className="app-bar-inner">
          <Link href={`${base}/`} className="app-brand">
            <LogoMark size={30} />
            <span>Unlocked <b>SAT</b></span>
          </Link>
          <nav className="app-nav" aria-label="App">
            {items.map((i) => (
              <Link key={i.key} href={i.href} aria-current={isActive(i.href) ? 'page' : undefined}>{i.label}</Link>
            ))}
          </nav>
          <div className="app-bar-right">
            <div className="locale-switch">
              {locales.map((l) => (
                <Link key={l} href={swap(l)} aria-current={l === locale ? 'true' : undefined}>{localeLabels[l]}</Link>
              ))}
            </div>
            <Link href={`/${locale}/`} className="app-site-link">{t.app.nav.site} ↗</Link>
          </div>
        </div>
      </header>
      <main className="app-main" id="main">{children}</main>
      <nav className="app-tabs" aria-label="App">
        {items.map((i) => (
          <Link key={i.key} href={i.href} aria-current={isActive(i.href) ? 'page' : undefined}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={icons[i.key]} /></svg>
            <span>{i.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
