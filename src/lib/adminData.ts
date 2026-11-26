'use client';
// Admin-side data helpers: form model, validation and database calls for questions.
import { parseNumeric, type Question } from '@/data/questions';
import { skills, type Section, type SkillId } from '@/data/skills';
import { getDb, QUESTION_COLUMNS, type QuestionRow } from './supabase';

export type Draft = {
  id?: string;
  section: Section;
  skill: SkillId;
  difficulty: 1 | 2 | 3;
  type: 'mc' | 'grid';
  passage: string;
  prompt: string;
  choices: [string, string, string, string];
  answer: number;
  acceptText: string;
  explanation: string;
  status: 'draft' | 'published';
};

export const emptyDraft = (section: Section = 'rw'): Draft => ({
  section,
  skill: section === 'rw' ? 'words-in-context' : 'linear-equations',
  difficulty: 2,
  type: 'mc',
  passage: '',
  prompt: '',
  choices: ['', '', '', ''],
  answer: 0,
  acceptText: '',
  explanation: '',
  status: 'draft',
});

export function rowToDraft(r: QuestionRow): Draft {
  const mc = Array.isArray(r.choices);
  return {
    id: r.id,
    section: r.section,
    skill: (r.skill in skills ? r.skill : emptyDraft(r.section).skill) as SkillId,
    difficulty: Math.min(3, Math.max(1, r.difficulty)) as Draft['difficulty'],
    type: mc ? 'mc' : 'grid',
    passage: r.passage || '',
    prompt: r.prompt,
    choices: mc ? ([0, 1, 2, 3].map((i) => (r.choices as string[])[i] || '') as Draft['choices']) : ['', '', '', ''],
    answer: mc ? r.answer ?? 0 : 0,
    acceptText: mc ? '' : (r.accept || []).join('; '),
    explanation: r.explanation || '',
    status: r.status,
  };
}

/** Accepted answers: separated by ";" or new lines. Each may be an integer, decimal or fraction (3,000 → 3000). */
export function parseAccept(text: string): { values: number[]; bad: string[] } {
  const parts = text.split(/[;\n]+/).map((s) => s.trim()).filter(Boolean);
  const values: number[] = [];
  const bad: string[] = [];
  for (const p of parts) {
    const v = parseNumeric(p);
    if (v === null) bad.push(p);
    else values.push(v);
  }
  return { values, bad };
}

export function validate(d: Draft): string[] {
  const e: string[] = [];
  if (!(d.skill in skills) || skills[d.skill].section !== d.section) e.push('Choose a skill that belongs to the selected section.');
  if (!d.prompt.trim()) e.push('The question text (prompt) is required.');
  if (d.type === 'mc') {
    if (d.choices.some((c) => !c.trim())) e.push('All four answer choices (A–D) are required.');
    if (new Set(d.choices.map((c) => c.trim())).size < 4) e.push('Answer choices must be different from each other.');
    if (d.answer < 0 || d.answer > 3) e.push('Mark the correct choice.');
  } else {
    const { values, bad } = parseAccept(d.acceptText);
    if (bad.length) e.push(`Not a number: ${bad.join(', ')}`);
    if (!values.length) e.push('Enter at least one accepted numeric answer.');
    if (values.length > 5) e.push('At most 5 accepted answers.');
  }
  if (d.section === 'rw' && !d.passage.trim()) e.push('Reading & Writing questions need a passage.');
  return e;
}

export function draftToRow(d: Draft): Omit<QuestionRow, 'id'> & { id?: string } {
  const mc = d.type === 'mc';
  return {
    ...(d.id ? { id: d.id } : {}),
    section: d.section,
    skill: d.skill,
    difficulty: d.difficulty,
    passage: d.passage.trim() || null,
    prompt: d.prompt.trim(),
    choices: mc ? d.choices.map((c) => c.trim()) : null,
    answer: mc ? d.answer : null,
    accept: mc ? null : parseAccept(d.acceptText).values,
    explanation: d.explanation.trim(),
    status: d.status,
  };
}

export function questionToRow(q: Question, status: 'draft' | 'published' = 'published'): QuestionRow {
  return {
    id: q.id,
    section: q.section,
    skill: q.skill,
    difficulty: q.difficulty,
    passage: q.passage ?? null,
    prompt: q.prompt,
    choices: q.choices ? [...q.choices] : null,
    answer: q.choices ? q.answer : null,
    accept: q.accept ? [...q.accept] : null,
    explanation: q.explanation,
    status,
  };
}

const newId = () => 'q' + Array.from(crypto.getRandomValues(new Uint8Array(5)), (b) => b.toString(16).padStart(2, '0')).join('');

// ───────── Database calls (row-level security allows writes for admins only) ─────────

export async function listAll(): Promise<QuestionRow[]> {
  const db = await getDb()!;
  const rows: QuestionRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from('questions').select(QUESTION_COLUMNS).order('updated_at', { ascending: false }).range(from, from + 999);
    if (error) throw error;
    rows.push(...((data || []) as QuestionRow[]));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

export async function saveDraft(d: Draft): Promise<QuestionRow> {
  const db = await getDb()!;
  const row = draftToRow(d);
  const q = d.id
    ? db.from('questions').update(row).eq('id', d.id).select(QUESTION_COLUMNS).single()
    : db.from('questions').insert(row).select(QUESTION_COLUMNS).single();
  const { data, error } = await q;
  if (error) throw error;
  return data as unknown as QuestionRow;
}

export async function deleteQuestion(id: string) {
  const db = await getDb()!;
  const { error } = await db.from('questions').delete().eq('id', id);
  if (error) throw error;
}

/** Insert or update many rows by id (import / starter questions). Returns number written. */
export async function upsertRows(rows: Partial<QuestionRow>[]): Promise<number> {
  const db = await getDb()!;
  let n = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100).map((r) => ({ ...r, id: r.id || newId() }));
    const { error } = await db.from('questions').upsert(chunk, { onConflict: 'id' });
    if (error) throw error;
    n += chunk.length;
  }
  return n;
}

/** Validate rows from an imported JSON file. Accepts the export format. */
export function checkImport(data: unknown): { rows: Partial<QuestionRow>[]; errors: string[] } {
  const errors: string[] = [];
  const rows: Partial<QuestionRow>[] = [];
  if (!Array.isArray(data)) return { rows, errors: ['The file must contain a JSON array of questions.'] };
  data.forEach((raw, i) => {
    const r = raw as QuestionRow;
    const label = `#${i + 1}${r && r.id ? ` (${r.id})` : ''}`;
    if (!r || typeof r !== 'object' || (r.section !== 'rw' && r.section !== 'math')) {
      errors.push(`${label}: section must be "rw" or "math".`);
      return;
    }
    const d = rowToDraft({ ...r, status: r.status === 'published' ? 'published' : 'draft', difficulty: Number(r.difficulty) || 2, prompt: String(r.prompt || '') });
    d.skill = r.skill as SkillId;
    const errs = validate(d);
    if (errs.length) errors.push(`${label}: ${errs.join(' ')}`);
    else rows.push({ ...draftToRow(d), id: r.id || undefined });
  });
  return { rows, errors };
}
