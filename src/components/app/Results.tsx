'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/components/I18nProvider';
import { AccBar } from './Bars';
import { Passage } from './QuestionView';
import { questionById, answerLabel } from '@/data/questions';
import { fmt } from '@/lib/i18n';
import { formatDate } from '@/lib/dates';
import { skillName, skillStats, useStore, type Attempt } from '@/lib/store';

export function Results() {
  const { locale, t } = useI18n();
  const r = t.app.results;
  const params = useSearchParams();
  const [st, hydrated] = useStore();
  if (!hydrated) return <div className="app-wrap"><div className="panel skeleton" /></div>;
  const id = params.get('id');
  const res = (id ? st.results.find((x) => x.id === id) : undefined) || st.results[st.results.length - 1];
  if (!res) return <div className="app-wrap"><p>{r.notFound}</p><Link className="btn btn-ink" href={`/${locale}/app/test/`}>{t.app.nav.test}</Link></div>;

  const items = res.sections.flatMap((s) => [...s.m1, ...s.m2]);
  const pseudo: Attempt[] = items.map((i) => ({ qid: i.qid, correct: i.correct, at: res.at, source: 'diagnostic' }));
  const stats = skillStats(pseudo).sort((a, b) => a.acc - b.acc);
  const L = ['A', 'B', 'C', 'D'];
  const show = (qid: string, v: unknown) => {
    const q = questionById[qid];
    if (v === null || v === undefined || v === '') return r.none;
    return q.accept ? String(v) : `${L[v as number]}) ${q.choices![v as number]}`;
  };

  return (
    <div className="app-wrap">
      <p className="caption">{r.eyebrow} · {formatDate(res.at, locale)}</p>
      <h1 className="app-h1">{r.title}</h1>
      <div className="res-grid">
        <section className="panel panel-dark res-total">
          <p className="res-big">{res.total}</p>
          <p className="muted">{fmt(r.range, { a: res.low, b: res.high })}</p>
        </section>
        {res.sections.map((s) => (
          <section className="panel" key={s.section}>
            <p className="caption">{s.section === 'rw' ? t.app.common.rw : t.app.common.math}</p>
            <p className="res-mid">{s.score}</p>
            <p className="muted">{fmt(r.range, { a: s.low, b: s.high })}</p>
            <span className={`chip ${s.route === 'hard' ? 'chip-gold' : ''}`}>{s.route === 'hard' ? r.route.hard : r.route.easy}</span>
            <p className="caption" style={{ marginTop: 10 }}>M1 {s.m1.filter((i) => i.correct).length}/{s.m1.length} · M2 {s.m2.filter((i) => i.correct).length}/{s.m2.length}</p>
          </section>
        ))}
      </div>
      <p className="caption res-note">{r.estimateNote}</p>

      <section className="panel">
        <h2 className="app-h2">{r.bySkill}</h2>
        <div className="bars bars-2">
          {stats.map((s) => (
            <AccBar key={s.skill} label={skillName(s.skill)} acc={s.acc} meta={`${s.correct}/${s.n}`} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="app-h2">{r.review}</h2>
        <div className="review-list">
          {items.map((it, i) => {
            const q = questionById[it.qid];
            return (
              <details key={it.qid + i} className={`review-item ${it.correct ? 'is-ok' : 'is-bad'}`}>
                <summary>
                  <span className="ri-n">{i + 1}</span>
                  <span className="ri-skill">{skillName(q.skill)}</span>
                  <span className="ri-state">{it.correct ? `✓ ${t.app.common.correct}` : `✕ ${t.app.common.incorrect}`}</span>
                </summary>
                <div className="ri-body">
                  {q.passage && <Passage text={q.passage} />}
                  <p className="q-prompt">{q.prompt}</p>
                  <p><b>{r.yours}:</b> {show(q.id, it.response)}</p>
                  <p><b>{r.correctAns}:</b> {answerLabel(q)}</p>
                  <p className="ri-exp"><b>{r.explanation}:</b> {q.explanation}</p>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <div className="btn-row">
        <Link className="btn btn-gold" href={`/${locale}/app/mistakes/`}>{r.toMistakes} <span className="arrow" aria-hidden>→</span></Link>
        <Link className="btn btn-ghost" href={`/${locale}/app/`}>{r.toDash}</Link>
      </div>
    </div>
  );
}
