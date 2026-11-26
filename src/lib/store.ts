'use client';
// Client-side progress store (localStorage). Shaped so it can later be replaced by API calls.
import { useSyncExternalStore } from 'react';
import { getBank } from './bank';
import { skills, type Section, type SkillId } from '@/data/skills';

export type Reason = 'concept' | 'careless' | 'misread' | 'time' | 'guess';
export const reasons: Reason[] = ['concept', 'careless', 'misread', 'time', 'guess'];
export type Source = 'diagnostic' | 'practice' | 'retry';
export type Response = string | number | null;

export type Profile = { name: string; target: number; examDate: string | null; createdAt: number };
export type Attempt = { qid: string; correct: boolean; at: number; source: Source };
export type Mistake = { qid: string; at: number; response: Response; reason?: Reason; status: 'open' | 'fixed'; fixedAt?: number };
export type ItemResult = { qid: string; response: Response; correct: boolean };
export type SectionResult = { section: Section; route: 'hard' | 'easy'; m1: ItemResult[]; m2: ItemResult[]; score: number; low: number; high: number };
export type TestResult = { id: string; at: number; sections: SectionResult[]; total: number; low: number; high: number };

export type TestSession = {
  testId: string;
  startedAt: number;
  sectionIdx: number;
  stage: 'm1' | 'm2' | 'break' | 'routing';
  route?: 'hard' | 'easy';
  qids: string[];
  answers: Record<string, Response>;
  marked: string[];
  eliminated: Record<string, number[]>;
  current: number;
  remaining: number; // seconds left in current module
  done: { section: Section; route: 'hard' | 'easy'; m1: ItemResult[]; m2: ItemResult[] }[];
  m1Items?: ItemResult[];
};

export type State = {
  version: 1;
  profile: Profile | null;
  attempts: Attempt[];
  mistakes: Record<string, Mistake>;
  results: TestResult[];
  session: TestSession | null;
};

const KEY = 'unlocked.state.v1';
const empty: State = { version: 1, profile: null, attempts: [], mistakes: {}, results: [], session: null };

let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...empty, ...JSON.parse(raw) };
  } catch {
    state = empty;
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}

const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => empty;

/** Returns [state, hydrated]. `hydrated` is false during SSR / first client render. */
export function useStore(): [State, boolean] {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return [s, hydrated];
}

export const actions = {
  setProfile(p: Omit<Profile, 'createdAt'>) {
    set({ profile: { ...p, createdAt: state.profile?.createdAt ?? Date.now() } });
  },

  /** Record one answered question and update the mistake journal. */
  record(qid: string, response: Response, correct: boolean, source: Source) {
    const at = Date.now();
    const attempts = [...state.attempts, { qid, correct, at, source }];
    const mistakes = { ...state.mistakes };
    const m = mistakes[qid];
    if (!correct) {
      mistakes[qid] = { qid, at, response, reason: m?.status === 'open' ? m.reason : undefined, status: 'open' };
    } else if (m && m.status === 'open') {
      mistakes[qid] = { ...m, status: 'fixed', fixedAt: at };
    }
    set({ attempts, mistakes });
  },

  setReason(qid: string, reason: Reason) {
    const m = state.mistakes[qid];
    if (m) set({ mistakes: { ...state.mistakes, [qid]: { ...m, reason } } });
  },

  saveSession(session: TestSession | null) {
    set({ session });
  },

  finishTest(result: TestResult) {
    const at = result.at;
    const attempts = [...state.attempts];
    const mistakes = { ...state.mistakes };
    for (const s of result.sections) {
      for (const it of [...s.m1, ...s.m2]) {
        attempts.push({ qid: it.qid, correct: it.correct, at, source: 'diagnostic' });
        const m = mistakes[it.qid];
        if (!it.correct) mistakes[it.qid] = { qid: it.qid, at, response: it.response, reason: m?.status === 'open' ? m.reason : undefined, status: 'open' };
        else if (m?.status === 'open') mistakes[it.qid] = { ...m, status: 'fixed', fixedAt: at };
      }
    }
    set({ results: [...state.results, result], attempts, mistakes, session: null });
  },

  reset() {
    set({ ...empty });
  },

  exportJson() {
    return JSON.stringify(state, null, 2);
  },
};

// ───────── Derived data ─────────

export type SkillStat = { skill: SkillId; n: number; correct: number; acc: number };

export function skillStats(attempts: Attempt[]): SkillStat[] {
  const map = new Map<SkillId, { n: number; correct: number }>();
  for (const a of attempts) {
    const q = getBank().byId[a.qid];
    if (!q) continue;
    const s = map.get(q.skill) || { n: 0, correct: 0 };
    s.n++;
    if (a.correct) s.correct++;
    map.set(q.skill, s);
  }
  return [...map.entries()].map(([skill, s]) => ({ skill, ...s, acc: Math.round((s.correct / s.n) * 100) }));
}

export function weakestSkills(attempts: Attempt[], k = 3) {
  return skillStats(attempts)
    .filter((s) => s.n >= 1)
    .sort((a, b) => a.acc - b.acc || b.n - a.n)
    .slice(0, k);
}

const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);

export function streak(attempts: Attempt[]) {
  const days = new Set(attempts.map((a) => dayKey(a.at)));
  let n = 0;
  const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function daysUntil(date: string | null) {
  if (!date) return null;
  return Math.max(0, Math.ceil((new Date(date + 'T08:00:00').getTime() - Date.now()) / 86400000));
}

export function dailyMinutes(gap: number, days: number) {
  const m = 20 + (Math.max(0, gap) / Math.max(days, 14)) * 25;
  return Math.max(20, Math.min(120, Math.round(m / 5) * 5));
}

export function skillName(id: SkillId) {
  return skills[id].name;
}
