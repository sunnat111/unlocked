'use client';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { fmt } from '@/lib/i18n';

export function RoutingDemo() {
  const { t } = useI18n();
  const d = t.keys.k1.demo;
  const [strong, setStrong] = useState(true);
  const c = strong ? 19 : 11;
  const p = Math.round((c / 22) * 100);
  return (
    <div className="demo">
      <p className="caption">{d.label}</p>
      <div className="toggle-group demo-toggles" role="group" aria-label={d.label}>
        <button className="toggle" aria-pressed={strong} onClick={() => setStrong(true)}>{d.strong}</button>
        <button className="toggle" aria-pressed={!strong} onClick={() => setStrong(false)}>{d.weak}</button>
      </div>
      <div className="demo-box">
        <p className="caption">{d.stage}</p>
        <p className="demo-acc">{fmt(d.accuracy, { c, p })}</p>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={22} aria-valuenow={c}>
          <span style={{ width: `${p}%` }} />
          <i style={{ left: `${(16 / 22) * 100}%` }} aria-hidden />
        </div>
      </div>
      <div className="outcomes" aria-live="polite">
        <div className={`outcome${strong ? ' is-active' : ''}`}>
          <div className="outcome-top">
            <span className="caption">{d.hard.cap}</span>
            <span className="outcome-status">{strong ? `✓ ${d.hard.status}` : `× ${d.easy.status}`}</span>
          </div>
          <p className="outcome-value">{d.hard.value}</p>
          <p className="outcome-note">{d.hard.note}</p>
        </div>
        <div className={`outcome${!strong ? ' is-active' : ''}`}>
          <div className="outcome-top">
            <span className="caption">{d.easy.cap}</span>
            <span className="outcome-status">{!strong ? '●' : ''}</span>
          </div>
          <p className="outcome-value">{d.easy.value}</p>
          <p className="outcome-note">{d.easy.note}</p>
        </div>
      </div>
      <p className="demo-disclaimer">{d.disclaimer}</p>
    </div>
  );
}
