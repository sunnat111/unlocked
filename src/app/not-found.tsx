import Link from 'next/link';
import { LogoMark } from '@/components/Logo';
import en from '@/i18n/en';
import uz from '@/i18n/uz';
import ru from '@/i18n/ru';

// Root 404 (static export → 404.html). Shown for any unknown URL, so it carries all three languages.
export default function NotFound() {
  return (
    <main className="nf tone-dark">
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}><LogoMark size={64} /></div>
        <p className="code">404</p>
        <h1>{uz.notFound.title}</h1>
        <p className="muted">{uz.notFound.body}</p>
        <p className="muted" style={{ marginTop: 6 }}>{ru.notFound.body} · {en.notFound.body}</p>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 28 }}>
          <Link href="/uz/" className="btn btn-gold">{uz.notFound.home}</Link>
          <Link href="/ru/" className="btn btn-ghost-dark">Русский</Link>
          <Link href="/en/" className="btn btn-ghost-dark">English</Link>
        </div>
      </div>
    </main>
  );
}
