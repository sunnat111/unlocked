'use client';
// Supabase (hosted PostgreSQL) client. Configured at build time:
//   NEXT_PUBLIC_SUPABASE_URL       e.g. https://abcd1234.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY  the project's public "anon" / "publishable" key (safe to ship to browsers;
//                                  row-level security in supabase/schema.sql decides what it can do)
// Without them the site runs on the built-in question bank only.
import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const dbEnabled = Boolean(url && key);

let clientPromise: Promise<SupabaseClient> | null = null;

/** Lazily loads supabase-js so pages that never touch the database do not download it. */
export function getDb(): Promise<SupabaseClient> | null {
  if (!dbEnabled) return null;
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'unlocked.auth' } }),
    );
  }
  return clientPromise;
}

/** Database row ⇄ app question. */
export type QuestionRow = {
  id: string;
  section: 'rw' | 'math';
  skill: string;
  difficulty: number;
  passage: string | null;
  prompt: string;
  choices: string[] | null;
  answer: number | null;
  accept: (number | string)[] | null;
  explanation: string;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
};

export const QUESTION_COLUMNS = 'id,section,skill,difficulty,passage,prompt,choices,answer,accept,explanation,status,created_at,updated_at';
