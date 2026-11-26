'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { QuestionView } from './QuestionView';
import { ReasonPicker } from './ReasonPicker';
import { questions, questionById, isCorrect, type Difficulty } from '@/data/questions';
import { skills, skillsBySection, type Section, type SkillId } from '@/data/skills';
import { fmt } from '@/lib/i18n';
import { actions, useStore, type Response } from '@/lib/store';

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function Practice() {
  const { t } = useI18n();
  const p = t.app.practice;
  const params = useSearchParams();
  const initialSkill = params.get('skill') as SkillId | null;
  const validSkill = initialSkill && initialSkill in skills ? initialSkill : null;
  const [section, setSection] = useState<Section>(validSkill ? skills[validSkill].section : 'rw');
  const [skill, setSkill] = useState<SkillId | 'all'>(validSkill || 'all');
  const [diff, setDiff] = useState<Difficulty | 0>(0);
  const [count, setCount] = useState(5);
  const [run, setRun] = useState<{ qids: string[]; i: number; resp: Response; checked: boolean; score: number } | null>(null);
  const [st] = useStore();

  const pool = useMemo(
    () => questions.filter((q) => q.section === section && (skill === 'all' || q.skill === skill) && (!diff || q.difficulty === diff)),
    [section, skill, diff],
  );

  const start = () => {
    if (!pool.length) return;
    setRun({ qids: shuffle(pool).slice(0, count).map((q) => q.id), i: 0, resp: null, checked: false, score: 0 });
  };

  if (run) {
    const done = run.i >= run.qids.length;
    if (done) {
      return (
        <div className="app-wrap narrow">
          <section className="panel center">
            <p className="caption">{p.eyebrow}</p>
            <p className="res-big">{fmt(p.summary, { c: run.score, t: run.qids.length })}</p>
            <div className="btn-row">
              <button className="btn btn-gold" onClick={start}>{p.again} <span className="arrow" aria-hidden>→</span></button>
              <button className="btn btn-ghost" onClick={() => setRun(null)}>{t.app.common.back}</button>
            </div>
          </section>
        </div>
      );
    }
    const q = questionById[run.qids[run.i]];
    const correct = run.checked && isCorrect(q, run.resp);
    const mistake = st.mistakes[q.id];
    return (
      <div className="app-wrap">
        <div className="practice-top">
          <button className="link-btn" onClick={() => setRun(null)}>← {t.app.common.back}</button>
          <span className="caption">{skills[q.skill].name} · {run.i + 1} / {run.qids.length}</span>
          <div className="progress-dots">{run.qids.map((id, i) => <i key={id} className={i < run.i ? 'is-done' : i === run.i ? 'is-cur' : ''} />)}</div>
        </div>
        <section className="panel">
          <QuestionView key={q.id} q={q} layout={q.passage ? 'split' : 'stack'} response={run.resp} onChange={(r) => !run.checked && setRun({ ...run, resp: r })} reveal={run.checked} disabled={run.checked} />
          {run.checked && (
            <div className={`feedback ${correct ? 'is-ok' : 'is-bad'}`}>
              <p className="feedback-title">{correct ? `✓ ${t.app.common.correct}` : `✕ ${t.app.common.incorrect}`}</p>
              <p>{q.explanation}</p>
              {!correct && <ReasonPicker qid={q.id} value={mistake?.reason} label={p.why} />}
            </div>
          )}
          <div className="btn-row">
            {!run.checked ? (
              <button
                className="btn btn-ink"
                disabled={run.resp === null || run.resp === ''}
                onClick={() => {
                  const ok = isCorrect(q, run.resp);
                  actions.record(q.id, run.resp, ok, 'practice');
                  setRun({ ...run, checked: true, score: run.score + (ok ? 1 : 0) });
                }}
              >
                {p.check}
              </button>
            ) : (
              <button className="btn btn-gold" onClick={() => setRun({ ...run, i: run.i + 1, resp: null, checked: false })}>
                {run.i + 1 < run.qids.length ? p.nextQ : p.finish} <span className="arrow" aria-hidden>→</span>
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-wrap narrow">
      <p className="caption">{p.eyebrow}</p>
      <h1 className="app-h1">{p.title}</h1>
      <section className="panel setup">
        <div className="field">
          <span>{p.section}</span>
          <div className="segmented">
            {(['rw', 'math'] as Section[]).map((s) => (
              <button key={s} aria-pressed={section === s} onClick={() => { setSection(s); setSkill('all'); }}>{s === 'rw' ? t.app.common.rw : t.app.common.math}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>{p.skill}</span>
          <div className="toggle-group">
            <button className="toggle toggle-sm" aria-pressed={skill === 'all'} onClick={() => setSkill('all')}>{p.all}</button>
            {skillsBySection(section).map((id) => (
              <button key={id} className="toggle toggle-sm" aria-pressed={skill === id} onClick={() => setSkill(id)}>{skills[id].name}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>{p.difficulty}</span>
          <div className="toggle-group">
            {([0, 1, 2, 3] as const).map((d) => (
              <button key={d} className="toggle toggle-sm" aria-pressed={diff === d} onClick={() => setDiff(d)}>
                {d === 0 ? p.any : d === 1 ? t.app.common.easy : d === 2 ? t.app.common.medium : t.app.common.hard}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>{p.count}</span>
          <div className="toggle-group">
            {[5, 10, 20].map((n) => (
              <button key={n} className="toggle toggle-sm" aria-pressed={count === n} onClick={() => setCount(n)}>{n}</button>
            ))}
          </div>
        </div>
        {pool.length ? (
          <button className="btn btn-gold btn-lg" onClick={start}>{p.start} ({Math.min(count, pool.length)}) <span className="arrow" aria-hidden>→</span></button>
        ) : (
          <p className="muted">{p.none}</p>
        )}
        <p className="caption">{fmt(p.limit, { n: 20 })}</p>
      </section>
    </div>
  );
}
