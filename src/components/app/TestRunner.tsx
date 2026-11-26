'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { LogoMark } from '@/components/Logo';
import { QuestionView } from './QuestionView';
import { Calculator } from './Calculator';
import { diagnostic } from '@/data/tests';
import { isCorrect, type Question } from '@/data/questions';
import { useBank } from '@/lib/bank';
import { actions, useStore, type ItemResult, type TestSession, type TestResult } from '@/lib/store';
import { fmt } from '@/lib/i18n';
import { miniSectionScore, ROUTE_THRESHOLD } from '@/lib/scoring';

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

function grade(qids: string[], answers: TestSession['answers'], questionById: Record<string, Question>): ItemResult[] {
  return qids.map((qid) => {
    const response = answers[qid] ?? null;
    return { qid, response, correct: isCorrect(questionById[qid], response) };
  });
}

export function TestRunner() {
  const { locale, t } = useI18n();
  const tt = t.app.test;
  const router = useRouter();
  const [{ session }, hydrated] = useStore();
  const { byId: questionById } = useBank();
  const byIdRef = useRef(questionById);
  byIdRef.current = questionById;
  const [s, setS] = useState<TestSession | null>(null);
  const [view, setView] = useState<'question' | 'review'>('question');
  const [navOpen, setNavOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [dirOpen, setDirOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [elimOn, setElimOn] = useState(false);
  const [timeUpNote, setTimeUpNote] = useState(false);
  const sRef = useRef<TestSession | null>(null);
  sRef.current = s;

  // Load stored session once hydrated.
  useEffect(() => {
    if (hydrated && s === null && session) setS(session);
  }, [hydrated, session, s]);

  const update = useCallback((patch: Partial<TestSession>, persist = true) => {
    const prev = sRef.current;
    if (!prev) return;
    const next = { ...prev, ...patch };
    sRef.current = next;
    setS(next);
    if (persist) actions.saveSession(next);
  }, []);

  const sectionDef = s ? diagnostic.sections[s.sectionIdx] : null;
  const inModule = !!s && (s.stage === 'm1' || s.stage === 'm2');

  const submitModule = useCallback((auto = false) => {
    const cur = sRef.current;
    if (!cur) return;
    const def = diagnostic.sections[cur.sectionIdx];
    const items = grade(cur.qids, cur.answers, byIdRef.current);
    setView('question');
    setNavOpen(false);
    setCalcOpen(false);
    setTimeUpNote(auto);
    if (cur.stage === 'm1') {
      const correct = items.filter((i) => i.correct).length;
      const route = correct >= ROUTE_THRESHOLD ? 'hard' : 'easy';
      const next: TestSession = { ...cur, stage: 'routing', route, m1Items: items };
      actions.saveSession(next);
      setS(next);
      return;
    }
    // finished Module 2
    const done = [...cur.done, { section: def.section, route: cur.route!, m1: cur.m1Items || [], m2: items }];
    if (cur.sectionIdx + 1 < diagnostic.sections.length) {
      const next: TestSession = { ...cur, done, stage: 'break', m1Items: undefined, route: undefined };
      actions.saveSession(next);
      setS(next);
      return;
    }
    // Test complete → score
    const sections = done.map((d) => {
      const m1c = d.m1.filter((i) => i.correct).length;
      const m2c = d.m2.filter((i) => i.correct).length;
      const sc = miniSectionScore(m1c, m2c, d.route === 'hard');
      return { ...d, score: sc.score, low: sc.low, high: sc.high };
    });
    const total = sections.reduce((a, b) => a + b.score, 0);
    const result: TestResult = {
      id: `r${Date.now().toString(36)}`,
      at: Date.now(),
      sections,
      total,
      low: sections.reduce((a, b) => a + b.low, 0),
      high: sections.reduce((a, b) => a + b.high, 0),
    };
    actions.finishTest(result);
    router.push(`/${locale}/app/results/?id=${result.id}`);
  }, [locale, router]);

  // Timer
  useEffect(() => {
    if (!inModule) return;
    let ticks = 0;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const cur = sRef.current;
      if (!cur) return;
      const remaining = cur.remaining - 1;
      ticks++;
      if (remaining <= 0) {
        window.clearInterval(id);
        sRef.current = { ...cur, remaining: 0 };
        submitModule(true);
        return;
      }
      update({ remaining }, ticks % 5 === 0);
    }, 1000);
    return () => window.clearInterval(id);
  }, [inModule, s?.stage, s?.sectionIdx, update, submitModule]);

  // Persist on unload
  useEffect(() => {
    const save = () => sRef.current && actions.saveSession(sRef.current);
    window.addEventListener('pagehide', save);
    return () => window.removeEventListener('pagehide', save);
  }, []);

  const begin = () => {
    const def = diagnostic.sections[0];
    const next: TestSession = {
      testId: diagnostic.id, startedAt: Date.now(), sectionIdx: 0, stage: 'm1',
      qids: def.m1.questionIds, answers: {}, marked: [], eliminated: {}, current: 0,
      remaining: def.m1.minutes * 60, done: [],
    };
    actions.saveSession(next);
    setS(next);
    setView('question');
  };

  const startM2 = () => {
    if (!s || !sectionDef) return;
    const mod = s.route === 'hard' ? sectionDef.hard : sectionDef.easy;
    update({ stage: 'm2', qids: mod.questionIds, current: 0, remaining: mod.minutes * 60 });
    setTimeUpNote(false);
  };

  const startNextSection = () => {
    if (!s) return;
    const idx = s.sectionIdx + 1;
    const def = diagnostic.sections[idx];
    update({ sectionIdx: idx, stage: 'm1', qids: def.m1.questionIds, current: 0, remaining: def.m1.minutes * 60 });
    setTimeUpNote(false);
  };

  const discard = () => {
    actions.saveSession(null);
    setS(null);
  };

  const secName = (sec: 'rw' | 'math') => (sec === 'rw' ? t.app.common.rw : t.app.common.math);

  // ───────── Screens ─────────
  if (!hydrated || (session && !s)) return <div className="test-loading" />;

  if (!s) {
    return (
      <div className="test-intro tone-dark">
        <div className="test-intro-card">
          <Link href={`/${locale}/app/`} className="test-back">← {t.app.common.back}</Link>
          <LogoMark size={48} />
          <p className="caption">{tt.introEyebrow}</p>
          <h1>{tt.introTitle}</h1>
          <p className="muted">{tt.introBody}</p>
          <ul className="intro-list">{tt.introList.map((x) => <li key={x}>{x}</li>)}</ul>
          <button className="btn btn-gold btn-lg" onClick={begin}>{tt.begin} <span className="arrow" aria-hidden>→</span></button>
        </div>
      </div>
    );
  }

  if (!inModule) {
    const nextIdx = s.sectionIdx + 1;
    return (
      <div className="test-intro tone-dark">
        <div className="test-intro-card">
          <LogoMark size={48} />
          {timeUpNote && <p className="notice notice-dark">{tt.timeUp}</p>}
          {s.stage === 'routing' && sectionDef && (
            <>
              <p className="caption">{fmt(tt.section, { n: s.sectionIdx + 1, name: secName(sectionDef.section) })}</p>
              <h1>{s.route === 'hard' ? tt.routedHard : tt.routedEasy}</h1>
              <div className={`route-chip ${s.route === 'hard' ? 'is-hard' : ''}`}>
                {fmt(tt.module, { n: 2 })} · {s.route === 'hard' ? t.app.results.route.hard : t.app.results.route.easy}
              </div>
              <button className="btn btn-gold btn-lg" onClick={startM2}>{tt.continueNext} <span className="arrow" aria-hidden>→</span></button>
            </>
          )}
          {s.stage === 'break' && (
            <>
              <h1>{fmt(tt.breakTitle, { name: secName(diagnostic.sections[nextIdx].section) })}</h1>
              <p className="muted">{tt.breakBody}</p>
              <button className="btn btn-gold btn-lg" onClick={startNextSection}>{tt.continueNext} <span className="arrow" aria-hidden>→</span></button>
            </>
          )}
          <button className="link-btn" onClick={() => confirm(`${tt.discard}?`) && discard()}>{tt.discard}</button>
        </div>
      </div>
    );
  }

  const qid = s.qids[s.current];
  const q = questionById[qid];
  const total = s.qids.length;
  const modNo = s.stage === 'm1' ? 1 : 2;
  const marked = s.marked.includes(qid);
  const answered = (id: string) => s.answers[id] !== undefined && s.answers[id] !== null && s.answers[id] !== '';
  const lowTime = s.remaining <= 60;

  const go = (i: number) => {
    update({ current: i });
    setView('question');
    setNavOpen(false);
  };

  const navGrid = (
    <div className="nav-grid">
      {s.qids.map((id, i) => (
        <button
          key={id}
          onClick={() => go(i)}
          className={`nav-cell${answered(id) ? ' is-answered' : ''}${s.marked.includes(id) ? ' is-marked' : ''}${i === s.current && view === 'question' ? ' is-current' : ''}`}
          aria-label={`${i + 1}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  return (
    <div className="test">
      <header className="test-top">
        <div className="test-top-left">
          <strong>{fmt(tt.section, { n: s.sectionIdx + 1, name: secName(sectionDef!.section) })}</strong>
          <span>{fmt(tt.module, { n: modNo })}</span>
          <button className="test-tool-link" onClick={() => setDirOpen((v) => !v)} aria-expanded={dirOpen}>{tt.directions} ▾</button>
        </div>
        <div className={`test-timer${lowTime ? ' is-low' : ''}`} role="timer" aria-live={lowTime ? 'polite' : 'off'}>
          {showTimer ? <span className="test-time">{mmss(s.remaining)}</span> : <span className="test-time">··:··</span>}
          <button onClick={() => setShowTimer((v) => !v)}>{showTimer ? tt.hideTimer : tt.showTimer}</button>
        </div>
        <div className="test-top-right">
          {sectionDef!.section === 'math' && (
            <button className="test-tool" onClick={() => setCalcOpen((v) => !v)} aria-pressed={calcOpen}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" /></svg>
              <span>{tt.calculator}</span>
            </button>
          )}
        </div>
      </header>
      {dirOpen && (
        <div className="test-directions">
          <p>{sectionDef!.section === 'rw' ? tt.dirRW : tt.dirMath}</p>
          <button className="btn btn-ink btn-sm" onClick={() => setDirOpen(false)}>{t.app.common.close}</button>
        </div>
      )}
      <div className="test-rule" aria-hidden />

      <main className="test-main" id="main">
        {view === 'question' ? (
          <QuestionView
            key={qid}
            q={q}
            layout={q.passage ? 'split' : 'stack'}
            response={s.answers[qid] ?? null}
            onChange={(r) => update({ answers: { ...s.answers, [qid]: r } })}
            eliminator={elimOn && !q.accept}
            eliminated={s.eliminated[qid] || []}
            onEliminate={(i) => {
              const cur = s.eliminated[qid] || [];
              const nextE = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i];
              const answers = { ...s.answers };
              if (!cur.includes(i) && answers[qid] === i) delete answers[qid];
              update({ eliminated: { ...s.eliminated, [qid]: nextE }, answers });
            }}
            header={
              <div className="q-head">
                <span className="q-num">{s.current + 1}</span>
                <button className={`q-mark${marked ? ' is-on' : ''}`} onClick={() => update({ marked: marked ? s.marked.filter((x) => x !== qid) : [...s.marked, qid] })} aria-pressed={marked}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill={marked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M6 3h12v18l-6-4-6 4z" /></svg>
                  {marked ? tt.marked : tt.mark}
                </button>
                {!q.accept && (
                  <button className={`q-elim${elimOn ? ' is-on' : ''}`} onClick={() => setElimOn((v) => !v)} aria-pressed={elimOn} title={tt.eliminate}>
                    <s>ABC</s>
                  </button>
                )}
              </div>
            }
          />
        ) : (
          <section className="review">
            <h1>{tt.reviewTitle}</h1>
            <p className="muted">{tt.reviewBody}</p>
            <div className="review-legend">
              <span><i className="lg-un" /> {tt.unanswered}</span>
              <span><i className="lg-mk" /> {tt.marked}</span>
            </div>
            {navGrid}
            <button className="btn btn-ink btn-lg" onClick={() => confirm(tt.submitConfirm) && submitModule(false)}>{tt.submitModule} <span className="arrow" aria-hidden>→</span></button>
          </section>
        )}
      </main>

      {calcOpen && <Calculator title={tt.calculator} onClose={() => setCalcOpen(false)} />}

      <footer className="test-bottom">
        <div className="test-bottom-left">{fmt(tt.section, { n: s.sectionIdx + 1, name: secName(sectionDef!.section) })}</div>
        <div className="test-bottom-center">
          <button className="q-counter" onClick={() => setNavOpen((v) => !v)} aria-expanded={navOpen}>
            {view === 'review' ? tt.review : fmt(tt.question, { n: s.current + 1, t: total })} ▴
          </button>
          {navOpen && (
            <div className="nav-pop" role="dialog">
              <div className="review-legend">
                <span><i className="lg-un" /> {tt.unanswered}</span>
                <span><i className="lg-mk" /> {tt.marked}</span>
              </div>
              {navGrid}
              <button className="btn btn-ghost btn-sm" onClick={() => { setView('review'); setNavOpen(false); }}>{tt.review}</button>
            </div>
          )}
        </div>
        <div className="test-bottom-right">
          {(view === 'review' || s.current > 0) && (
            <button className="btn btn-ghost btn-sm" onClick={() => (view === 'review' ? setView('question') : go(s.current - 1))}>{t.app.common.back}</button>
          )}
          {view === 'question' && (
            <button className="btn btn-ink btn-sm" onClick={() => (s.current + 1 < total ? go(s.current + 1) : setView('review'))}>{t.app.common.next}</button>
          )}
        </div>
      </footer>
    </div>
  );
}
