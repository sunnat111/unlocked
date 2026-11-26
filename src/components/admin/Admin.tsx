'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useI18n } from '@/components/I18nProvider';
import { LogoMark } from '@/components/Logo';
import { QuestionView } from '@/components/app/QuestionView';
import { questions as builtIn } from '@/data/questions';
import { skills, skillsBySection, type Section, type SkillId } from '@/data/skills';
import { dbEnabled, getDb, type QuestionRow } from '@/lib/supabase';
import { loadBank, rowToQuestion } from '@/lib/bank';
import { checkImport, deleteQuestion, draftToRow, emptyDraft, listAll, questionToRow, rowToDraft, saveDraft, upsertRows, validate, type Draft } from '@/lib/adminData';
import type { Response } from '@/lib/store';

const L = ['A', 'B', 'C', 'D'];
const errText = (e: unknown) => (e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : String(e));

// ───────────────────────── Setup + sign-in ─────────────────────────

function SetupNeeded() {
  return (
    <div className="admin-center">
      <div className="panel admin-card">
        <LogoMark size={40} />
        <h1 className="app-h1">Connect the database</h1>
        <p className="muted">This build has no database connection yet, so the site uses the built-in questions. Follow <b>docs/DATABASE.md</b> in the repository: create a free Supabase project, run <code>supabase/schema.sql</code>, then add <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> as GitHub repository variables and redeploy.</p>
      </div>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <div className="admin-center">
      <form
        className="panel admin-card"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          const db = await getDb()!;
          const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
          if (error) setError(error.message);
          setBusy(false);
        }}
      >
        <LogoMark size={40} />
        <p className="caption">Unlocked SAT · Admin</p>
        <h1 className="app-h1">Sign in</h1>
        <label className="field"><span>Email</span><input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="field"><span>Password</span><input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="btn btn-ink btn-lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

// ───────────────────────── Editor ─────────────────────────

function Editor({ initial, onSaved, onDeleted, onCancel }: { initial: Draft; onSaved: (r: QuestionRow) => void; onDeleted: (id: string) => void; onCancel: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Response>(null);
  const [reveal, setReveal] = useState(false);
  useEffect(() => { setD(initial); setError(''); setPreview(null); setReveal(false); }, [initial]);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const problems = validate(d);
  const previewQ = rowToQuestion({ ...(draftToRow(d) as QuestionRow), id: d.id || 'preview', prompt: d.prompt || '(question text)', choices: d.type === 'mc' ? d.choices.map((c, i) => c || `(choice ${L[i]})`) : null, accept: d.type === 'grid' ? (draftToRow(d).accept?.length ? draftToRow(d).accept : [0]) : null });

  const save = async (status?: Draft['status']) => {
    const next = status ? { ...d, status } : d;
    const errs = validate(next);
    if (errs.length) { setError(errs.join(' ')); return; }
    setBusy(true); setError('');
    try { onSaved(await saveDraft(next)); } catch (e) { setError(errText(e)); }
    setBusy(false);
  };

  return (
    <div className="editor">
      <div className="editor-form">
        <div className="editor-head">
          <h2 className="app-h2">{d.id ? `Edit ${d.id}` : 'New question'}</h2>
          <span className={`chip ${d.status === 'published' ? 'chip-ok' : ''}`}>{d.status}</span>
        </div>

        <div className="field-grid">
          <div className="field">
            <span>Section</span>
            <div className="segmented">
              {(['rw', 'math'] as Section[]).map((s) => (
                <button type="button" key={s} aria-pressed={d.section === s} onClick={() => setD((x) => ({ ...x, section: s, skill: emptyDraft(s).skill, type: s === 'rw' ? 'mc' : x.type }))}>{s === 'rw' ? 'Reading & Writing' : 'Math'}</button>
              ))}
            </div>
          </div>
          <label className="field">
            <span>Skill</span>
            <select value={d.skill} onChange={(e) => set('skill', e.target.value as SkillId)}>
              {skillsBySection(d.section).map((id) => <option key={id} value={id}>{skills[id].domain} — {skills[id].name}</option>)}
            </select>
          </label>
          <div className="field">
            <span>Difficulty</span>
            <div className="segmented">
              {([1, 2, 3] as const).map((n) => <button type="button" key={n} aria-pressed={d.difficulty === n} onClick={() => set('difficulty', n)}>{['Easy', 'Medium', 'Hard'][n - 1]}</button>)}
            </div>
          </div>
          {d.section === 'math' && (
            <div className="field">
              <span>Answer type</span>
              <div className="segmented">
                <button type="button" aria-pressed={d.type === 'mc'} onClick={() => set('type', 'mc')}>Multiple choice</button>
                <button type="button" aria-pressed={d.type === 'grid'} onClick={() => set('type', 'grid')}>Student-produced</button>
              </div>
            </div>
          )}
        </div>

        <label className="field">
          <span>Passage {d.section === 'math' && <i>(optional)</i>}</span>
          <textarea rows={d.section === 'rw' ? 6 : 3} value={d.passage} onChange={(e) => set('passage', e.target.value)} placeholder={d.section === 'rw' ? 'Text the student reads. Use ______ for a blank. Start lines with • for notes.' : 'Optional table or context'} />
        </label>
        <label className="field">
          <span>Question</span>
          <textarea rows={2} value={d.prompt} onChange={(e) => set('prompt', e.target.value)} placeholder="e.g. Which choice completes the text with the most logical and precise word or phrase?" />
        </label>

        {d.type === 'mc' ? (
          <fieldset className="field">
            <legend>Choices — select the correct one</legend>
            <div className="choice-inputs">
              {d.choices.map((c, i) => (
                <label key={i} className={`choice-input${d.answer === i ? ' is-correct' : ''}`}>
                  <input type="radio" name="correct" checked={d.answer === i} onChange={() => set('answer', i)} aria-label={`${L[i]} is correct`} />
                  <b>{L[i]}</b>
                  <input value={c} onChange={(e) => { const next = [...d.choices] as Draft['choices']; next[i] = e.target.value; set('choices', next); }} placeholder={`Choice ${L[i]}`} />
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <label className="field">
            <span>Accepted answers</span>
            <input value={d.acceptText} onChange={(e) => set('acceptText', e.target.value)} placeholder="e.g. 3/4; 0.75" />
            <small className="muted">Separate equivalent answers with “;”. Fractions and decimals are both fine.</small>
          </label>
        )}

        <label className="field">
          <span>Explanation</span>
          <textarea rows={3} value={d.explanation} onChange={(e) => set('explanation', e.target.value)} placeholder="Why the correct answer is right (and the others are wrong)." />
        </label>

        {error && <p className="admin-error" role="alert">{error}</p>}
        {!error && problems.length > 0 && <p className="caption">Still needed: {problems.join(' ')}</p>}

        <div className="btn-row">
          <button className="btn btn-gold" disabled={busy} onClick={() => save('published')}>{d.status === 'published' ? 'Save' : 'Save & publish'}</button>
          {d.status === 'draft' ? (
            <button className="btn btn-ghost" disabled={busy} onClick={() => save('draft')}>Save as draft</button>
          ) : (
            <button className="btn btn-ghost" disabled={busy} onClick={() => save('draft')}>Unpublish</button>
          )}
          <button className="link-btn" onClick={onCancel}>Cancel</button>
          {d.id && (
            <button
              className="link-btn admin-danger"
              disabled={busy}
              onClick={async () => {
                if (!confirm(`Delete question ${d.id}? This cannot be undone.`)) return;
                setBusy(true);
                try { await deleteQuestion(d.id!); onDeleted(d.id!); } catch (e) { setError(errText(e)); }
                setBusy(false);
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <aside className="editor-preview">
        <div className="editor-head">
          <p className="caption">Student preview</p>
          <button className="link-btn" onClick={() => setReveal((v) => !v)}>{reveal ? 'Hide answer' : 'Show answer'}</button>
        </div>
        {previewQ ? (
          <div className="panel">
            <QuestionView q={previewQ} response={preview} onChange={setPreview} reveal={reveal} />
            {reveal && d.explanation && <div className="feedback is-ok"><p>{d.explanation}</p></div>}
          </div>
        ) : <p className="muted">Fill in the form to see a preview.</p>}
      </aside>
    </div>
  );
}

// ───────────────────────── Dashboard ─────────────────────────

function Manager({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const { locale } = useI18n();
  const [rows, setRows] = useState<QuestionRow[] | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);
  const [fSection, setFSection] = useState<'all' | Section>('all');
  const [fSkill, setFSkill] = useState<'all' | SkillId>('all');
  const [fStatus, setFStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [q, setQ] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setError('');
    try { setRows(await listAll()); } catch (e) { setError(errText(e)); setRows([]); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (rows || []).filter((r) =>
      (fSection === 'all' || r.section === fSection) &&
      (fSkill === 'all' || r.skill === fSkill) &&
      (fStatus === 'all' || r.status === fStatus) &&
      (!term || `${r.id} ${r.prompt} ${r.passage || ''}`.toLowerCase().includes(term)));
  }, [rows, fSection, fSkill, fStatus, q]);

  const counts = useMemo(() => {
    const c = { total: rows?.length || 0, published: 0, draft: 0, rw: 0, math: 0 };
    rows?.forEach((r) => { c[r.status]++; c[r.section]++; });
    return c;
  }, [rows]);

  const afterWrite = (msg: string) => { setNotice(msg); refresh(); loadBank(true); };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(rows || [], null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `unlocked-sat-questions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file: File) => {
    setError(''); setNotice('');
    try {
      const { rows: valid, errors } = checkImport(JSON.parse(await file.text()));
      if (errors.length) { setError(`Import stopped — fix these ${errors.length} problem(s) and try again:\n` + errors.slice(0, 10).join('\n') + (errors.length > 10 ? `\n…and ${errors.length - 10} more` : '')); return; }
      if (!confirm(`Import ${valid.length} question(s)? Questions with an existing id will be updated.`)) return;
      afterWrite(`Imported ${await upsertRows(valid)} question(s).`);
    } catch (e) { setError(`Could not import: ${errText(e)}`); }
  };

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link href={`/${locale}/`} className="app-brand"><LogoMark size={28} /><span>Unlocked <b>SAT</b> · Admin</span></Link>
        <div className="admin-bar-right">
          <span className="caption">{session.user.email}</span>
          <button className="link-btn" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <div className="admin-wrap">
        {notice && <p className="admin-notice" role="status">{notice}</p>}
        {error && <pre className="admin-error" role="alert">{error}</pre>}
        {editing ? (
          <Editor
            initial={editing}
            onCancel={() => { setNotice(''); setEditing(null); }}
            onSaved={(r) => { setEditing(rowToDraft(r)); afterWrite(`Saved ${r.id} (${r.status}).`); }}
            onDeleted={(id) => { setEditing(null); afterWrite(`Deleted ${id}.`); }}
          />
        ) : (
          <>
            <div className="admin-top">
              <div>
                <h1 className="app-h1">Questions</h1>
                <p className="muted">{counts.total} total · {counts.published} published · {counts.draft} drafts · {counts.rw} R&amp;W · {counts.math} Math</p>
              </div>
              <div className="btn-row">
                <button className="btn btn-gold" onClick={() => { setNotice(''); setError(''); setEditing(emptyDraft(fSection === 'math' ? 'math' : 'rw')); }}>+ New question</button>
                <button className="btn btn-ghost btn-sm" onClick={exportJson} disabled={!rows?.length}>Export JSON</button>
                <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>Import JSON</button>
                <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = ''; }} />
              </div>
            </div>

            {rows && rows.length === 0 && !error && (
              <div className="panel center">
                <p>The database is empty.</p>
                <button className="btn btn-ink" onClick={async () => {
                  try { afterWrite(`Added ${await upsertRows(builtIn.map((x) => questionToRow(x)))} starter questions.`); } catch (e) { setError(errText(e)); }
                }}>Add the {builtIn.length} starter questions</button>
              </div>
            )}

            <div className="admin-filters">
              <input type="search" placeholder="Search text or id…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
              <select value={fSection} onChange={(e) => { setFSection(e.target.value as 'all' | Section); setFSkill('all'); }} aria-label="Section">
                <option value="all">All sections</option><option value="rw">Reading &amp; Writing</option><option value="math">Math</option>
              </select>
              <select value={fSkill} onChange={(e) => setFSkill(e.target.value as 'all' | SkillId)} aria-label="Skill">
                <option value="all">All skills</option>
                {(fSection === 'all' ? (Object.keys(skills) as SkillId[]) : skillsBySection(fSection)).map((id) => <option key={id} value={id}>{skills[id].name}</option>)}
              </select>
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value as 'all' | 'draft' | 'published')} aria-label="Status">
                <option value="all">Any status</option><option value="published">Published</option><option value="draft">Drafts</option>
              </select>
            </div>

            {rows === null ? <div className="panel skeleton" /> : (
              <div className="admin-table" role="table">
                {shown.map((r) => (
                  <button key={r.id} className="admin-row" role="row" onClick={() => { setNotice(''); setError(''); setEditing(rowToDraft(r)); }}>
                    <span className="ar-id">{r.id}</span>
                    <span className="ar-meta">{r.section === 'rw' ? 'R&W' : 'Math'} · {skills[r.skill as SkillId]?.name || r.skill} · {'●'.repeat(r.difficulty)}{'○'.repeat(3 - r.difficulty)}</span>
                    <span className="ar-text">{(r.passage || r.prompt).replace(/\s+/g, ' ').slice(0, 140)}</span>
                    <span className={`chip ${r.status === 'published' ? 'chip-ok' : ''}`}>{r.status}</span>
                  </button>
                ))}
                {!shown.length && rows.length > 0 && <p className="muted">No questions match these filters.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── Gate ─────────────────────────

export function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!dbEnabled) return;
    let unsub = () => {};
    getDb()!.then((db) => {
      db.auth.getSession().then(({ data }) => setSession(data.session));
      const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
      unsub = () => data.subscription.unsubscribe();
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    getDb()!.then(async (db) => {
      const { data, error } = await db.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle();
      setIsAdmin(!error && !!data);
    });
  }, [session]);

  const signOut = async () => { await (await getDb()!).auth.signOut(); };

  if (!dbEnabled) return <SetupNeeded />;
  if (session === undefined || (session && isAdmin === null)) return <div className="admin-center"><div className="panel skeleton admin-card" /></div>;
  if (!session) return <SignIn />;
  if (!isAdmin) {
    return (
      <div className="admin-center">
        <div className="panel admin-card">
          <h1 className="app-h1">Not an admin yet</h1>
          <p className="muted">You are signed in as <b>{session.user.email}</b>, but this account cannot edit questions. In Supabase → SQL Editor, run:</p>
          <pre className="admin-code">{`insert into public.admins (user_id)\nselect id from auth.users where email = '${session.user.email}';`}</pre>
          <div className="btn-row"><button className="btn btn-ink" onClick={() => setSession({ ...session })}>Check again</button><button className="link-btn" onClick={signOut}>Sign out</button></div>
        </div>
      </div>
    );
  }
  return <Manager session={session} onSignOut={signOut} />;
}
