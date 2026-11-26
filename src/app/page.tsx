'use client';
import { useEffect } from 'react';

// Static export cannot redirect on the server: pick a locale in the browser.
export default function RootRedirect() {
  useEffect(() => {
    let target = 'uz';
    try {
      const saved = localStorage.getItem('unlocked.locale');
      const nav = (navigator.languages || [navigator.language]).map((l) => l.toLowerCase());
      if (saved && ['uz', 'ru', 'en'].includes(saved)) target = saved;
      else if (nav.some((l) => l.startsWith('uz'))) target = 'uz';
      else if (nav.some((l) => l.startsWith('ru') || l.startsWith('kk') || l.startsWith('tg'))) target = 'ru';
      else if (nav.some((l) => l.startsWith('en'))) target = 'en';
    } catch {}
    window.location.replace(`/${target}/`);
  }, []);
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0c1529', color: '#fff', fontFamily: 'system-ui' }}>
      <nav style={{ display: 'flex', gap: 24 }}>
        <a href="/uz/">O‘zbekcha</a>
        <a href="/ru/">Русский</a>
        <a href="/en/">English</a>
      </nav>
    </main>
  );
}
