'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { fmt } from '@/lib/i18n';
import { sectionScaled, totalTier } from '@/lib/scoring';

const presets = [
  { rw: 51, math: 42 },
  { rw: 44, math: 36 },
  { rw: 30, math: 22 },
];

export function ScoreSimulator() {
  const { locale, t } = useI18n();
  const s = t.sim;
  const [rw, setRw] = useState(presets[1].rw);
  const [math, setMath] = useState(presets[1].math);
  const total = sectionScaled(rw, 54) + sectionScaled(math, 44);
  const low = Math.max(400, total - 30);
  const high = Math.min(1600, total + 30);
  const tier = totalTier(total);
  const active = presets.findIndex((p) => p.rw === rw && p.math === math);

  const slider = (id: string, label: string, value: number, max: number, set: (n: number) => void) => (
    <div className="slider">
      <div className="slider-top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{sectionScaled(value, max)}</output>
      </div>
      <input id={id} className="range" type="range" min={0} max={max} value={value} onChange={(e) => set(+e.target.value)} style={{ ['--fill' as string]: `${(value / max) * 100}%` }} />
      <div className="slider-meta">
        <span>{fmt(s.correct, { c: value, t: max })}</span>
        <span>{fmt(s.accuracy, { p: Math.round((value / max) * 100) })}</span>
      </div>
    </div>
  );

  return (
    <div className="sim">
      <div className="toggle-group" role="group">
        {s.presets.map((label, i) => (
          <button key={label} className="toggle" aria-pressed={active === i} onClick={() => { setRw(presets[i].rw); setMath(presets[i].math); }}>
            {label}
          </button>
        ))}
      </div>
      <div className="sim-box">
        <p className="caption">{s.resultCap}</p>
        <p className="sim-score" aria-live="polite">
          {low}–{high}
        </p>
        <span className="chip">{s.tiers[tier]}</span>
        <div className="sim-sliders">
          {slider('rw-input', s.rw, rw, 54, setRw)}
          {slider('math-input', s.math, math, 44, setMath)}
        </div>
      </div>
      <div className="sim-foot">
        <p className="muted">{s.foot}</p>
        <Link href={`/${locale}/app/test/`} className="btn btn-ghost">
          {s.cta} <span className="arrow" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
