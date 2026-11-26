'use client';
// The question bank the app reads from: PostgreSQL (Supabase) when configured, with the
// built-in questions as fallback. Questions are cached in the browser so practice keeps
// working offline and loads instantly on the next visit.
import { useEffect, useSyncExternalStore } from 'react';
import { questions as builtIn, type Question } from '@/data/questions';
import { skills, type SkillId } from '@/data/skills';
import { dbEnabled, getDb, QUESTION_COLUMNS, type QuestionRow } from './supabase';

export type BankStatus = 'builtin' | 'loading' | 'database' | 'cached' | 'offline';
type Bank = { status: BankStatus; list: Question[]; byId: Record<string, Question> };

const CACHE_KEY = 'unlocked.bank.v1';
const builtInById: Record<string, Question> = Object.fromEntries(builtIn.map((q) => [q.id, q]));

let bank: Bank = { status: dbEnabled ? 'loading' : 'builtin', list: builtIn, byId: builtInById };
const listeners = new Set<() => void>();
let started = false;

export function rowToQuestion(r: QuestionRow): Question | null {
  if (!(r.skill in skills) || skills[r.skill as SkillId].section !== r.section) return null;
  const mc = Array.isArray(r.choices) && r.choices.length === 4;
  return {
    id: r.id,
    section: r.section,
    skill: r.skill as SkillId,
    difficulty: Math.min(3, Math.max(1, r.difficulty)) as Question['difficulty'],
    passage: r.passage || undefined,
    prompt: r.prompt,
    choices: mc ? (r.choices as Question['choices']) : undefined,
    answer: mc ? (r.answer ?? 0) : -1,
    accept: mc ? undefined : (r.accept || []).map(Number),
    explanation: r.explanation || '',
  };
}

function apply(rows: QuestionRow[], status: BankStatus) {
  const list = rows.map(rowToQuestion).filter((q): q is Question => q !== null);
  // An empty database (not seeded yet) keeps the built-in bank so the app is never empty.
  const pool = list.length ? list : builtIn;
  // byId keeps built-in entries too, so old results and mistakes always render.
  bank = { status, list: pool, byId: { ...builtInById, ...Object.fromEntries(pool.map((q) => [q.id, q])) } };
  listeners.forEach((l) => l());
}

function setStatus(status: BankStatus) {
  bank = { ...bank, status };
  listeners.forEach((l) => l());
}

export async function fetchPublished(): Promise<QuestionRow[]> {
  const db = await getDb()!;
  const rows: QuestionRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from('questions').select(QUESTION_COLUMNS).eq('status', 'published').order('id').range(from, from + 999);
    if (error) throw error;
    rows.push(...((data || []) as QuestionRow[]));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

export function loadBank(force = false) {
  if (!dbEnabled || (started && !force)) return;
  started = true;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && bank.status === 'loading') apply(JSON.parse(cached).rows, 'cached');
  } catch { /* ignore bad cache */ }
  fetchPublished()
    .then((rows) => {
      apply(rows, 'database');
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rows })); } catch { /* storage full */ }
    })
    .catch(() => setStatus(bank.status === 'cached' ? 'cached' : 'offline'));
}

/** Current bank outside React (store helpers). */
export const getBank = () => bank;

export function useBank(): Bank {
  useEffect(() => loadBank(), []);
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => bank,
    () => bank,
  );
}
