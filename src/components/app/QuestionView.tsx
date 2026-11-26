'use client';
import { useI18n } from '@/components/I18nProvider';
import type { Question } from '@/data/questions';
import { parseNumeric } from '@/data/questions';
import type { Response } from '@/lib/store';

type Props = {
  q: Question;
  response: Response;
  onChange: (r: Response) => void;
  /** reveal correct answer + state */
  reveal?: boolean;
  disabled?: boolean;
  eliminator?: boolean;
  eliminated?: number[];
  onEliminate?: (i: number) => void;
  /** number shown in the question header */
  number?: number;
  header?: React.ReactNode;
  layout?: 'split' | 'stack';
};

const L = ['A', 'B', 'C', 'D'];

export function Passage({ text }: { text: string }) {
  const parts = text.split('\n');
  return (
    <div className="passage">
      {parts.map((p, i) => (p.startsWith('•') ? <p key={i} className="passage-bullet">{p}</p> : <p key={i}>{p}</p>))}
    </div>
  );
}

export function QuestionView({ q, response, onChange, reveal, disabled, eliminator, eliminated = [], onEliminate, number, header, layout = 'stack' }: Props) {
  const { t } = useI18n();
  const grid = !!q.accept;
  const parsed = grid && typeof response === 'string' ? parseNumeric(response) : null;
  const body = (
    <div className="q-body">
      {header}
      {q.section === 'math' && <p className="q-prompt q-math">{q.prompt}</p>}
      {q.section === 'rw' && <p className="q-prompt">{q.prompt}</p>}
      {grid ? (
        <div className="grid-in">
          <label className="caption" htmlFor={`gi-${q.id}`}>{t.app.test.enterAnswer}</label>
          <input
            id={`gi-${q.id}`}
            className={`grid-input${reveal ? (q.accept!.some((v) => parsed !== null && Math.abs(parsed - v) < 1e-9) ? ' is-ok' : ' is-bad') : ''}`}
            inputMode="decimal"
            autoComplete="off"
            maxLength={9}
            value={typeof response === 'string' ? response : ''}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value.replace(/[^0-9./\-−,]/g, ''))}
          />
          <p className="grid-hint">{t.app.test.gridHint}</p>
          {reveal && <p className="grid-answer">{t.app.results.correctAns}: <b>{q.accept![0]}</b></p>}
        </div>
      ) : (
        <ol className="choices">
          {q.choices!.map((c, i) => {
            const selected = response === i;
            const struck = eliminated.includes(i);
            let cls = 'choice';
            if (selected) cls += ' is-selected';
            if (struck) cls += ' is-struck';
            if (reveal && i === q.answer) cls += ' is-ok';
            if (reveal && selected && i !== q.answer) cls += ' is-bad';
            return (
              <li key={i} className="choice-row">
                <button type="button" className={cls} onClick={() => !disabled && onChange(i)} aria-pressed={selected} disabled={disabled}>
                  <span className="choice-letter">{L[i]}</span>
                  <span className="choice-text">{c}</span>
                </button>
                {eliminator && !reveal && (
                  <button type="button" className={`strike${struck ? ' is-on' : ''}`} onClick={() => onEliminate?.(i)} aria-label={`${t.app.test.eliminate} ${L[i]}`}>
                    {struck ? '↺' : <s>{L[i]}</s>}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
  return (
    <div className={`qv qv-${q.section} qv-${layout}${q.passage ? ' has-passage' : ''}`} data-number={number}>
      {q.passage && <Passage text={q.passage} />}
      {body}
    </div>
  );
}
