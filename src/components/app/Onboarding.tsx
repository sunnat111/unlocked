'use client';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { actions, type Profile } from '@/lib/store';
import { upcomingSatDates } from '@/lib/config';
import { formatDate } from '@/lib/dates';

export function Onboarding({ initial, onDone }: { initial?: Profile | null; onDone?: () => void }) {
  const { locale, t } = useI18n();
  const o = t.app.onboarding;
  const dates = upcomingSatDates();
  const [name, setName] = useState(initial?.name || '');
  const [target, setTarget] = useState(initial?.target || 1400);
  const [examDate, setExamDate] = useState<string>(initial?.examDate ?? dates[0]?.date ?? '');
  const fmtDate = (d: string) => formatDate(d, locale);
  return (
    <form
      className="panel onboarding"
      onSubmit={(e) => {
        e.preventDefault();
        actions.setProfile({ name: name.trim() || 'Student', target, examDate: examDate || null });
        onDone?.();
      }}
    >
      <p className="caption">{o.eyebrow}</p>
      <h1 className="app-h1">{o.title}</h1>
      <label className="field">
        <span>{o.name}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="given-name" required />
      </label>
      <div className="field">
        <span className="field-row"><label htmlFor="target">{o.target}</label><output htmlFor="target" className="field-big">{target}</output></span>
        <input id="target" className="range" type="range" min={1000} max={1600} step={10} value={target} onChange={(e) => setTarget(+e.target.value)} style={{ ['--fill' as string]: `${((target - 1000) / 600) * 100}%` }} />
      </div>
      <fieldset className="field">
        <legend>{o.date}</legend>
        <div className="date-choices">
          {dates.map((d) => (
            <label key={d.date} className={`date-choice${examDate === d.date ? ' is-on' : ''}`}>
              <input type="radio" name="date" value={d.date} checked={examDate === d.date} onChange={() => setExamDate(d.date)} />
              {fmtDate(d.date)}
            </label>
          ))}
          <label className={`date-choice${examDate === '' ? ' is-on' : ''}`}>
            <input type="radio" name="date" value="" checked={examDate === ''} onChange={() => setExamDate('')} />
            {o.dateOther}
          </label>
        </div>
      </fieldset>
      <button className="btn btn-gold btn-lg" type="submit">{o.submit} <span className="arrow" aria-hidden>→</span></button>
      <p className="caption">{t.app.common.localNote}</p>
    </form>
  );
}
