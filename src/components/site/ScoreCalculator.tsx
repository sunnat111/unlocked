'use client';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { fmt } from '@/lib/i18n';
import { sectionScaled } from '@/lib/scoring';

export function ScoreCalculator() {
  const { t } = useI18n();
  const c = t.calc;
  const [rw, setRw] = useState(40);
  const [math, setMath] = useState(30);
  const rs = sectionScaled(rw, 54);
  const ms = sectionScaled(math, 44);
  const total = rs + ms;
  const rng = (v: number, lo: number, hi: number, d: number) => fmt(c.range, { a: Math.max(lo, v - d), b: Math.min(hi, v + d) });
  const slider = (id: string, label: string, value: number, max: number, set: (n: number) => void) => (
    <div className="slider">
      <div className="slider-top">
        <label htmlFor={id}>{label}</label>
        <span>
          <input className="num-input" type="number" min={0} max={max} value={value} onChange={(e) => set(Math.max(0, Math.min(max, +e.target.value || 0)))} aria-label={label} /> / {max}
        </span>
      </div>
      <input id={id} className="range" type="range" min={0} max={max} value={value} onChange={(e) => set(+e.target.value)} style={{ ['--fill' as string]: `${(value / max) * 100}%` }} />
    </div>
  );
  return (
    <div className="tool-card">
      <div className="sim-sliders" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
        {slider('calc-rw', c.rw, rw, 54, setRw)}
        {slider('calc-math', c.math, math, 44, setMath)}
      </div>
      <div className="result-row" aria-live="polite">
        <div className="result-tile"><p className="caption">{c.rw}</p><p className="result-num">{rs}</p><p className="muted">{rng(rs, 200, 800, 30)}</p></div>
        <div className="result-tile"><p className="caption">{c.math}</p><p className="result-num">{ms}</p><p className="muted">{rng(ms, 200, 800, 30)}</p></div>
        <div className="result-tile is-total"><p className="caption">{c.total}</p><p className="result-num">{total}</p><p className="muted">{rng(total, 400, 1600, 40)}</p></div>
      </div>
    </div>
  );
}
