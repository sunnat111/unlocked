'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { QuestionView } from './QuestionView';
import { ReasonPicker } from './ReasonPicker';
import { isCorrect } from '@/data/questions';
import { useBank } from '@/lib/bank';
import { skills } from '@/data/skills';
import { fmt } from '@/lib/i18n';
import { formatDate } from '@/lib/dates';
import { actions, useStore, type Mistake, type Response } from '@/lib/store';

function MistakeItem({ m }: { m: Mistake }) {
  const { locale, t } = useI18n();
  const mt = t.app.mistakes;
  const { byId } = useBank();
  const q = byId[m.qid];
  const [open, setOpen] = useState(false);
  const [resp, setResp] = useState<Response>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  if (!q) return null;
  const snippet = (q.passage || q.prompt).replace(/\n/g, ' ');
  const date = formatDate(m.at, locale, { short: true, year: false });
  return (
    <article className={`mistake panel ${m.status === 'fixed' ? 'is-fixed' : ''}`}>
      <header className="mistake-head">
        <span className="caption">{skills[q.skill].section === 'rw' ? t.app.common.rw : t.app.common.math} · {skills[q.skill].name}</span>
        <span className={`chip ${m.status === 'fixed' ? 'chip-ok' : 'chip-alert'}`}>{m.status === 'fixed' ? `✓ ${mt.fixed}` : mt.open}</span>
      </header>
      <p className="mistake-snippet">{snippet.length > 180 ? snippet.slice(0, 180) + '…' : snippet}</p>
      <p className="caption">{fmt(mt.when, { d: date })} · {mt.reason}: {m.reason ? t.app.reasons[m.reason] : mt.noReason}</p>
      {m.status === 'open' && !open && <ReasonPicker qid={m.qid} value={m.reason} label={mt.setReason} />}
      {open && (
        <div className="mistake-retry">
          <QuestionView q={q} layout={q.passage ? 'split' : 'stack'} response={resp} onChange={(r) => checked === null && setResp(r)} reveal={checked !== null} disabled={checked !== null} />
          {checked !== null && (
            <div className={`feedback ${checked ? 'is-ok' : 'is-bad'}`}>
              <p className="feedback-title">{checked ? mt.fixedMsg : mt.stillWrong}</p>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>
      )}
      <div className="btn-row">
        {!open && <button className="btn btn-ink btn-sm" onClick={() => setOpen(true)}>{mt.retry}</button>}
        {open && checked === null && (
          <button
            className="btn btn-ink btn-sm"
            disabled={resp === null || resp === ''}
            onClick={() => {
              const ok = isCorrect(q, resp);
              setChecked(ok);
              actions.record(q.id, resp, ok, 'retry');
            }}
          >
            {t.app.practice.check}
          </button>
        )}
        {open && <button className="btn btn-ghost btn-sm" onClick={() => { setOpen(false); setResp(null); setChecked(null); }}>{t.app.common.close}</button>}
        <Link className="btn btn-ghost btn-sm" href={`/${locale}/app/practice/?skill=${q.skill}`}>{mt.drill}</Link>
      </div>
    </article>
  );
}

export function Mistakes() {
  const { locale, t } = useI18n();
  const mt = t.app.mistakes;
  const [st, hydrated] = useStore();
  const [filter, setFilter] = useState<'open' | 'fixed' | 'all'>('open');
  if (!hydrated) return <div className="app-wrap"><div className="panel skeleton" /></div>;
  const all = Object.values(st.mistakes).sort((a, b) => b.at - a.at);
  const list = all.filter((m) => filter === 'all' || m.status === filter);
  const count = (f: 'open' | 'fixed') => all.filter((m) => m.status === f).length;
  return (
    <div className="app-wrap">
      <p className="caption">{mt.eyebrow}</p>
      <h1 className="app-h1">{mt.title}</h1>
      <div className="segmented" role="group">
        <button aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>{mt.open} <small>{count('open')}</small></button>
        <button aria-pressed={filter === 'fixed'} onClick={() => setFilter('fixed')}>{mt.fixed} <small>{count('fixed')}</small></button>
        <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{mt.all} <small>{all.length}</small></button>
      </div>
      <div className="mistake-list">
        {list.length ? list.map((m) => <MistakeItem key={m.qid} m={m} />) : (
          <div className="panel center">
            <p className="muted">{mt.empty}</p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <Link className="btn btn-gold" href={`/${locale}/app/test/`}>{t.app.nav.test}</Link>
              <Link className="btn btn-ghost" href={`/${locale}/app/practice/`}>{t.app.nav.practice}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
