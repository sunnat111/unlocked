import { Header } from './Header';
import { Footer } from './Footer';
import { HeroGlow } from './HeroGlow';

export function PageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-hero tone-dark">
          <HeroGlow />
          <div className="shell">
            <p className="eyebrow"><b>{eyebrow}</b></p>
            <h1>{title}</h1>
            {intro && <p className="lead">{intro}</p>}
          </div>
        </section>
        <section className="section tone-paper inner-section">
          <div className="shell inner-stack">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
