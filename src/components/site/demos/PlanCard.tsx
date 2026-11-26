'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { upcomingSatDates } from '@/lib/config';
import { formatDate } from '@/lib/dates';

export function PlanCard() {
  const { locale, t } = useI18n();
  const c = t.keys.k3.card;
  const [state, setState] = useState<{ date: string; days: number } | null>(null);
  useEffect(() => {
    const next = upcomingSatDates()[0];
    if (!next) return;
    const days = Math.ceil((new Date(next.date + 'T08:00:00').getTime() - Date.now()) / 86400000);
    setState({ date: next.date, days });
  }, []);
  const dateLabel = state
    ? formatDate(state.date, locale, { short: true })
    : '—';
  return (
    <div className="demo">
      <div className="plan-grid">
        <div className="demo-box">
          <p className="caption">{c.exam}</p>
          <p className="plan-big">{dateLabel}</p>
        </div>
        <div className="demo-box">
          <p className="caption">{c.days}</p>
          <p className="plan-big">{state ? state.days : '—'}</p>
        </div>
      </div>
      <p className="demo-note">↻ {c.note}</p>
      <div className="focus-tile">
        <div className="outcome-top">
          <span className="caption">{c.focusCap}</span>
          <span className="chip">{c.focusChip}</span>
        </div>
        <p className="focus-title">{c.focusTitle}</p>
        <p className="focus-meta">{c.focusMeta}</p>
        <p className="focus-tick">✓ {c.focusTick}</p>
      </div>
    </div>
  );
}
