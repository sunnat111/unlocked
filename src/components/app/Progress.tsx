'use client';
import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';
import { AccBar } from './Bars';
import { skills, skillsBySection, type Section } from '@/data/skills';
import { fmt } from '@/lib/i18n';
import { actions, skillStats, useStore } from '@/lib/store';

function ScoreChart({ points, target }: { points: { at: number; total: number; low: number; high: number }[]; target: number }) {
  const W = 640, H = 240, P = 36;
  const min = 400, max = 1600;
  const x = (i: number) => (points.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (points.length - 1));
  const y = (v: number) => H - P - ((v - min) / (max - min)) * (H - 2 * P);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.total)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Score history">
      {[400, 800, 1200, 1600].map((v) => (
        <g key={v}>
          <line x1={P} x2={W - P} y1={y(v)} y2={y(v)} className="chart-grid" />
          <text x={4} y={y(v) + 4} className="chart-label">{v}</text>
        </g>
      ))}
      <line x1={P} x2={W - P} y1={y(target)} y2={y(target)} className="chart-target" />
      <text x={W - P} y={y(target) - 6} textAnchor="end" className="chart-label chart-target-label">{target}</text>
      {points.map((p, i) => <line key={'r' + i} x1={x(i)} x2={x(i)} y1={y(p.low)} y2={y(p.high)} className="chart-range" />)}
      <path d={line} className="chart-line" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.total)} r={5} className="chart-dot" />
          <text x={x(i)} y={y(p.total) - 12} textAnchor="middle" className="chart-val">{p.total}</text>
        </g>
      ))}
    </svg>
  );
}

export function Progress() {
  const { locale, t } = useI18n();
  const pr = t.app.progress;
  const [st, hydrated] = useStore();
  if (!hydrated) return <div className="app-wrap"><div className="panel skeleton" /></div>;
  const stats = skillStats(st.attempts);
  const bySkill = new Map(stats.map((s) => [s.skill, s]));
  const download = () => {
    const blob = new Blob([actions.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'unlocked-sat-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="app-wrap">
      <p className="caption">{pr.eyebrow}</p>
      <h1 className="app-h1">{pr.title}</h1>
      <section className="panel">
        <h2 className="app-h2">{pr.history}</h2>
        {st.results.length ? (
          <ScoreChart points={st.results} target={st.profile?.target || 1400} />
        ) : (
          <div className="center">
            <p className="muted">{pr.noHistory}</p>
            <Link className="btn btn-gold" href={`/${locale}/app/test/`}>{t.app.nav.test} <span className="arrow" aria-hidden>→</span></Link>
          </div>
        )}
      </section>
      <section className="panel">
        <h2 className="app-h2">{pr.skills}</h2>
        <div className="skills-cols">
          {(['rw', 'math'] as Section[]).map((sec) => (
            <div key={sec}>
              <p className="caption">{sec === 'rw' ? t.app.common.rw : t.app.common.math}</p>
              <div className="bars">
                {skillsBySection(sec).map((id) => {
                  const s = bySkill.get(id);
                  return s ? (
                    <Link key={id} href={`/${locale}/app/practice/?skill=${id}`} className="bar-link">
                      <AccBar label={skills[id].name} acc={s.acc} meta={fmt(pr.attempts, { n: s.n })} />
                    </Link>
                  ) : (
                    <div key={id} className="accbar is-empty"><div className="accbar-top"><span>{skills[id].name}</span><b>—</b></div><div className="accbar-track" /></div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="app-foot">
        <button className="btn btn-ghost btn-sm" onClick={download}>{pr.export}</button>
        <button className="link-btn" onClick={() => confirm(t.app.common.resetConfirm) && actions.reset()}>{t.app.common.reset}</button>
      </div>
    </div>
  );
}
