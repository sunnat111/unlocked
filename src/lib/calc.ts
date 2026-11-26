// Small safe expression evaluator for the in-test calculator (no eval).
// Supports + − × ÷ ^, parentheses, unary minus, π, √(…), and implicit multiplication like 2π or 3(4).

type Tok = { t: 'num'; v: number } | { t: 'op'; v: string } | { t: 'lp' } | { t: 'rp' } | { t: 'fn'; v: 'sqrt' };

function tokenize(src: string): Tok[] {
  const s = src.replace(/\s+/g, '').replace(/×|\*/g, '*').replace(/÷|\//g, '/').replace(/−|–/g, '-').replace(/π|pi/gi, 'π').replace(/√|sqrt/gi, '√');
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const v = Number(s.slice(i, j));
      if (Number.isNaN(v)) throw new Error('num');
      out.push({ t: 'num', v });
      i = j;
      continue;
    }
    if (c === 'π') out.push({ t: 'num', v: Math.PI });
    else if (c === '√') out.push({ t: 'fn', v: 'sqrt' });
    else if ('+-*/^'.includes(c)) out.push({ t: 'op', v: c });
    else if (c === '(') out.push({ t: 'lp' });
    else if (c === ')') out.push({ t: 'rp' });
    else throw new Error('char');
    i++;
  }
  // implicit multiplication: num|rp followed by num|lp|fn
  const res: Tok[] = [];
  for (const tk of out) {
    const prev = res[res.length - 1];
    if (prev && (prev.t === 'num' || prev.t === 'rp') && (tk.t === 'num' || tk.t === 'lp' || tk.t === 'fn')) res.push({ t: 'op', v: '*' });
    res.push(tk);
  }
  return res;
}

export function evaluate(src: string): number {
  const toks = tokenize(src);
  let pos = 0;
  const peek = () => toks[pos];
  const next = () => toks[pos++];

  function primary(): number {
    const tk = next();
    if (!tk) throw new Error('end');
    if (tk.t === 'num') return tk.v;
    if (tk.t === 'lp') {
      const v = expr();
      if (next()?.t !== 'rp') throw new Error('paren');
      return v;
    }
    if (tk.t === 'fn') {
      const v = unary();
      if (v < 0) throw new Error('domain');
      return Math.sqrt(v);
    }
    if (tk.t === 'op' && tk.v === '-') return -unary();
    if (tk.t === 'op' && tk.v === '+') return unary();
    throw new Error('syntax');
  }
  function power(): number {
    const base = primary();
    const tk = peek();
    if (tk && tk.t === 'op' && tk.v === '^') {
      next();
      return Math.pow(base, unary()); // right-associative
    }
    return base;
  }
  function unary(): number {
    const tk = peek();
    if (tk && tk.t === 'op' && (tk.v === '-' || tk.v === '+')) {
      next();
      const v = unary();
      return tk.v === '-' ? -v : v;
    }
    return power();
  }
  function term(): number {
    let v = unary();
    for (;;) {
      const tk = peek();
      if (tk && tk.t === 'op' && (tk.v === '*' || tk.v === '/')) {
        next();
        const r = unary();
        v = tk.v === '*' ? v * r : v / r;
      } else return v;
    }
  }
  function expr(): number {
    let v = term();
    for (;;) {
      const tk = peek();
      if (tk && tk.t === 'op' && (tk.v === '+' || tk.v === '-')) {
        next();
        const r = term();
        v = tk.v === '+' ? v + r : v - r;
      } else return v;
    }
  }
  const v = expr();
  if (pos !== toks.length) throw new Error('trailing');
  if (!Number.isFinite(v)) throw new Error('inf');
  return v;
}

export function formatResult(v: number) {
  const r = Math.round(v * 1e10) / 1e10;
  return String(r);
}
