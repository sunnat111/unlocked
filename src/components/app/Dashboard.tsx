'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { Onboarding } from './Onboarding';
import { AccBar } from './Bars';
import { fmt } from '@/lib/i18n';
import { useBank } from '@/lib/bank';
import { formatDate } from '@/lib/dates';
import { actions, dailyMinutes, daysUntil, skillName, streak, useStore, weakestSkills } from '@/lib/store';

export function Dashboard() {
  const { locale, t } = useI18n();
  const d = t.app.dash;
  const [st, hydrated] = useStore();
  useBank(); // re-render when database questions arrive
  const [editing, setEditing] = useState(false);
  const base = `/${locale}/app`;

  if (!hydrated) return <div className="app-wrap"><div className="panel skeleton" /></div>;
  if (!st.profile || editing) return <div className="app-wrap narrow"><Onboarding initial={st.profile} onDone={() => setEditing(false)} /></div>;

  const p = st.profile;
  const days = daysUntil(p.examDate);
  const latest = st.results[st.results.length - 1];
  const gap = latest ? p.target - latest.total : p.target - 1000;
  const openMistakes = Object.values(st.mistakes).filter((m) => m.status === 'open');
  const fixed = Object.values(st.mistakes).filter((m) => m.status === 'fixed').length;
  const weak = weakestSkills(st.attempts, 3);
  const answered = st.attempts.length;
  const acc = answered ? Math.round((st.attempts.filter((a) => a.correct).length / answered) * 100) : 0;
  const examLabel = p.examDate
    ? formatDate(p.examDate, locale)
    : null;

  let focus: { title: string; meta: string; href: string };
  if (!latest) focus = { title: d.focusDiag, meta: d.focusDiagMeta, href: `${base}/test/` };
  else if (openMistakes.length >= 3) focus = { title: fmt(d.focusMistakes, { n: openMistakes.length }), meta: d.focusMistakesMeta, href: `${base}/mistakes/` };
  else if (weak[0]) focus = { title: fmt(d.focusSkill, { skill: skillName(weak[0].skill) }), meta: fmt(d.focusSkillMeta, { p: weak[0].acc }), href: `${base}/practice/?skill=${weak[0].skill}` };
  else focus = { title: d.focusDiag, meta: d.focusDiagMeta, href: `${base}/test/` };

  return (
    <div className="app-wrap">
      <div className="dash-head">
        <h1 className="app-h1">{fmt(d.hello, { name: p.name })}</h1>
        <button className="link-btn" onClick={() => setEditing(true)}>{d.edit}</button>
      </div>

      <div className="dash-grid">
        <section className="panel panel-dark dash-count">
          {days !== null ? (
            <>
              <p className="dash-big">{days}</p>
              <p>{d.daysLeft}</p>
              <p className="caption">{examLabel}</p>
            </>
          ) : (
            <p className="muted">{d.noDate}</p>
          )}
        </section>

        <section className="panel dash-score">
          <p className="caption">{d.latest}</p>
          {latest ? (
            <>
              <p className="dash-big">{latest.total}</p>
              <p className="muted">{latest.low}–{latest.high}</p>
            </>
          ) : (
            <p className="dash-big muted-2">—</p>
          )}
          <div className="dash-target">
            <span>{d.target}: <b>{p.target}</b></span>
            <span className="muted">{latest ? (gap > 0 ? fmt(d.gap, { n: gap }) : d.reached) : d.noScore}</span>
          </div>
        </section>

        <section className="panel panel-gold dash-focus">
          <p className="caption">{d.focus}</p>
          <p className="focus-title-lg">{focus.title}</p>
          <p className="muted">{focus.meta}</p>
          <Link className="btn btn-ink" href={focus.href}>{d.go} <span className="arrow" aria-hidden>→</span></Link>
        </section>

        <section className="panel dash-plan">
          <p className="caption">{d.plan}</p>
          <p className="plan-line">
            {days !== null ? fmt(d.planBody, { w: Math.max(1, Math.ceil(days / 7)), m: dailyMinutes(gap, days) }) : d.planNoDate}
          </p>
          <p className="caption" style={{ marginTop: 18 }}>{d.weakest}</p>
          {weak.length ? (
            <div className="bars">
              {weak.map((w) => (
                <Link key={w.skill} href={`${base}/practice/?skill=${w.skill}`} className="bar-link">
                  <AccBar label={skillName(w.skill)} acc={w.acc} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">{d.noData}</p>
          )}
        </section>
      </div>

      <div className="stat-row">
        <div className="mini-stat"><b>{answered}</b><span>{d.stats.answered}</span></div>
        <div className="mini-stat"><b>{answered ? `${acc}%` : '—'}</b><span>{d.stats.accuracy}</span></div>
        <div className="mini-stat"><b>{streak(st.attempts)}</b><span>{d.stats.streak}</span></div>
        <div className="mini-stat"><b>{fixed}</b><span>{d.stats.fixed}</span></div>
      </div>

      <div className="app-foot">
        <span className="caption">{t.app.common.localNote}</span>
        <button className="link-btn" onClick={() => confirm(t.app.common.resetConfirm) && actions.reset()}>{t.app.common.reset}</button>
      </div>
    </div>
  );
}
