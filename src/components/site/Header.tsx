'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { useI18n } from '@/components/I18nProvider';
import { localeLabels, locales } from '@/lib/i18n';
import { withBase } from '@/lib/base';

export function Header({ solid = false }: { solid?: boolean }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || `/${locale}/`;
  const [scrolled, setScrolled] = useState(solid);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (solid) return;
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [solid]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const home = `/${locale}/`;
  const anchors = [
    { href: `${home}#keys`, label: t.nav.keys },
    { href: `${home}#method`, label: t.nav.method },
    { href: `${home}#simulator`, label: t.nav.simulator },
    { href: `${home}#pricing`, label: t.nav.pricing },
    { href: `${home}#faq`, label: t.nav.faq },
  ];
  const tools = [
    { href: `/${locale}/score-calculator/`, label: t.nav.calculator },
    { href: `/${locale}/sat-dates/`, label: t.nav.dates },
  ];
  const swap = (l: string) => pathname.replace(/^\/(uz|ru|en)(?=\/|$)/, `/${l}`);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="shell site-header-inner">
        <Link href={home} className="site-logo" aria-label="Unlocked SAT — home">
          <Logo />
        </Link>
        <nav className="site-nav" aria-label="Main">
          {anchors.map((a) => (
            <a key={a.href} href={withBase(a.href)}>{a.label}</a>
          ))}
          <Link href={tools[0].href}>{tools[0].label}</Link>
        </nav>
        <div className="site-header-right">
          <div className="locale-switch" aria-label={t.nav.language}>
            {locales.map((l) => (
              <Link key={l} href={swap(l)} aria-current={l === locale ? 'true' : undefined} hrefLang={l}>
                {localeLabels[l]}
              </Link>
            ))}
          </div>
          <Link href={`/${locale}/app/`} className="btn btn-gold btn-sm header-cta">
            {t.nav.startFree} <span className="arrow" aria-hidden>→</span>
          </Link>
          <button className="burger" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
            <span className="sr-only">{t.nav.menu}</span>
            <span aria-hidden className="burger-lines" />
          </button>
        </div>
      </div>

      <div id="drawer" className={`drawer${open ? ' is-open' : ''}`} hidden={!open} role="dialog" aria-modal="true" aria-label={t.nav.menu}>
        <div className="drawer-top">
          <Logo />
          <button className="drawer-close" onClick={() => setOpen(false)}>
            {t.nav.close} <span aria-hidden>×</span>
          </button>
        </div>
        <nav className="drawer-nav" onClick={() => setOpen(false)}>
          {[...anchors, ...tools].map((a, i) => (
            <a key={a.href} href={withBase(a.href)}>
              <span className="caption">{String(i + 1).padStart(2, '0')}</span>
              {a.label}
            </a>
          ))}
        </nav>
        <div className="drawer-bottom">
          <Link href={`/${locale}/app/`} className="btn btn-gold btn-block" onClick={() => setOpen(false)}>
            {t.hero.cta1} <span className="arrow" aria-hidden>→</span>
          </Link>
          <div className="locale-switch locale-switch-lg">
            {locales.map((l) => (
              <Link key={l} href={swap(l)} aria-current={l === locale ? 'true' : undefined} hrefLang={l} onClick={() => setOpen(false)}>
                {localeLabels[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
