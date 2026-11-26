'use client';
import { useEffect, useRef, useState } from 'react';
import { evaluate, formatResult } from '@/lib/calc';

const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', 'π', '+', '(', ')', '^', '√'];

export function Calculator({ title, onClose }: { title: string; onClose: () => void }) {
  const [expr, setExpr] = useState('');
  const [out, setOut] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  const run = () => {
    try {
      const v = formatResult(evaluate(expr));
      setOut(v);
      setHistory((h) => [`${expr} = ${v}`, ...h].slice(0, 5));
      setExpr(v);
    } catch {
      setOut('Error');
    }
  };
  const press = (k: string) => {
    setOut('');
    setExpr((e) => e + (k === '√' ? '√(' : k));
    input.current?.focus();
  };
  return (
    <div className="calc" role="dialog" aria-label={title}>
      <div className="calc-head">
        <span>{title}</span>
        <button onClick={onClose} aria-label="Close">×</button>
      </div>
      <ul className="calc-history">{history.map((h, i) => <li key={i}>{h}</li>)}</ul>
      <input
        ref={input}
        className="calc-input"
        value={expr}
        onChange={(e) => { setExpr(e.target.value); setOut(''); }}
        onKeyDown={(e) => { if (e.key === 'Enter') run(); if (e.key === 'Escape') onClose(); }}
        aria-label="Expression"
        spellCheck={false}
      />
      <div className="calc-out" aria-live="polite">{out}</div>
      <div className="calc-keys">
        {keys.map((k) => <button key={k} onClick={() => press(k)}>{k}</button>)}
        <button className="calc-wide" onClick={() => { setExpr(''); setOut(''); }}>C</button>
        <button onClick={() => setExpr((e) => e.slice(0, -1))}>⌫</button>
        <button className="calc-eq" onClick={run}>=</button>
      </div>
    </div>
  );
}
