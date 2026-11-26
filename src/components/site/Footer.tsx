'use client';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useI18n } from '@/components/I18nProvider';
import { site } from '@/lib/config';
import { withBase } from '@/lib/base';

export function Footer() {
  const { locale, t } = useI18n();
  const home = `/${locale}/`;
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer tone-dark">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Logo size={36} />
            <p className="footer-about">{t.footer.about}</p>
          </div>
          <div>
            <h3 className="footer-title">{t.footer.contact}</h3>
            <ul className="footer-list">
              <li>{site.city}</li>
              <li><a href={site.telegram} target="_blank" rel="noopener noreferrer">Telegram {site.telegramHandle}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">{t.footer.platform}</h3>
            <ul className="footer-list">
              <li><a href={withBase(`${home}#keys`)}>{t.nav.keys}</a></li>
              <li><a href={withBase(`${home}#pricing`)}>{t.nav.pricing}</a></li>
              <li><Link href={`/${locale}/score-calculator/`}>{t.nav.calculator}</Link></li>
              <li><Link href={`/${locale}/sat-dates/`}>{t.nav.dates}</Link></li>
              <li><Link href={`/${locale}/app/`}>{t.nav.openApp}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">{t.footer.legal}</h3>
            <ul className="footer-list">
              <li><Link href={`/${locale}/terms/`}>{t.footer.terms}</Link></li>
              <li><Link href={`/${locale}/privacy/`}>{t.footer.privacy}</Link></li>
            </ul>
            <p className="footer-disclaimer">{t.footer.disclaimer}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Unlocked SAT. {t.footer.rights}</span>
          <span className="gold">{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
