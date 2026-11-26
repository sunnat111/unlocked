// Content + logic checks. Run: npm test
import { evaluate } from '../src/lib/calc.ts';
import { questions, isCorrect } from '../src/data/questions.ts';
import { diagnostic } from '../src/data/tests.ts';
import { skills } from '../src/data/skills.ts';

let fails = 0;
const fail = (m: string) => { fails++; console.error('✕', m); };

// Calculator
const cases: [string, number][] = [['2+3*4', 14], ['(2+3)*4', 20], ['2^3^2', 512], ['-3^2', -9], ['√16+1', 5], ['2π', 2 * Math.PI], ['10÷4', 2.5], ['3(4)', 12], ['−5+2', -3]];
for (const [e, v] of cases) if (Math.abs(evaluate(e) - v) > 1e-9) fail(`calc ${e}`);

// Questions
const ids = new Set<string>();
for (const q of questions) {
  if (ids.has(q.id)) fail(`duplicate id ${q.id}`);
  ids.add(q.id);
  if (!(q.skill in skills)) fail(`${q.id}: unknown skill`);
  if (skills[q.skill].section !== q.section) fail(`${q.id}: skill/section mismatch`);
  if (!q.explanation) fail(`${q.id}: no explanation`);
  if (q.accept) {
    if (q.choices) fail(`${q.id}: both choices and accept`);
    if (!isCorrect(q, String(q.accept[0]))) fail(`${q.id}: accepted answer rejected`);
  } else {
    if (!q.choices || q.choices.length !== 4) fail(`${q.id}: needs 4 choices`);
    if (q.answer < 0 || q.answer > 3) fail(`${q.id}: bad answer index`);
    if (new Set(q.choices).size !== 4) fail(`${q.id}: duplicate choices`);
  }
}

// Diagnostic modules reference real, unique questions of the right section
const used = new Set<string>();
for (const s of diagnostic.sections) {
  for (const m of [s.m1, s.easy, s.hard]) {
    for (const id of m.questionIds) {
      const q = questions.find((x) => x.id === id);
      if (!q) fail(`diagnostic: missing ${id}`);
      else if (q.section !== s.section) fail(`diagnostic: ${id} in wrong section`);
      if (used.has(id)) fail(`diagnostic: ${id} used twice`);
      used.add(id);
    }
  }
}

console.log(fails ? `${fails} check(s) failed` : `✓ all checks passed (${questions.length} questions)`);
process.exit(fails ? 1 : 0);
