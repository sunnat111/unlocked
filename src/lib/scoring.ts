// Score estimation. These are transparent approximations, not College Board's IRT scoring.

const round10 = (n: number) => Math.round(n / 10) * 10;
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

/** Full-length section estimate: raw correct of max → 200–800. Slightly concave curve. */
export function sectionScaled(raw: number, max: number) {
  const p = clamp(raw / max, 0, 1);
  return clamp(round10(200 + 600 * Math.pow(p, 0.92)), 200, 800);
}

export function withRange(score: number, spread: number, lo: number, hi: number) {
  return { score, low: clamp(round10(score - spread), lo, hi), high: clamp(round10(score + spread), lo, hi) };
}

export function totalTier(total: number) {
  if (total >= 1500) return 0;
  if (total >= 1350) return 1;
  if (total >= 1150) return 2;
  return 3;
}

/**
 * Mini adaptive test (7 + 7 questions per section).
 * Module 1 ≥ ROUTE_THRESHOLD correct → harder Module 2.
 * Standard route can reach at most ~520; harder route spans ~540–800.
 */
export const ROUTE_THRESHOLD = 5;

export function miniSectionScore(m1Correct: number, m2Correct: number, hardRoute: boolean, perModule = 7) {
  const p = (m1Correct + m2Correct) / (perModule * 2);
  const base = hardRoute ? 400 : 200;
  const score = clamp(round10(base + 400 * p), 200, 800);
  return withRange(score, 40, 200, 800);
}
