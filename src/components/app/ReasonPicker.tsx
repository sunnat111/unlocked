'use client';
import { useI18n } from '@/components/I18nProvider';
import { actions, reasons, type Reason } from '@/lib/store';

export function ReasonPicker({ qid, value, label }: { qid: string; value?: Reason; label: string }) {
  const { t } = useI18n();
  return (
    <div className="reasons">
      <p className="caption">{label}</p>
      <div className="toggle-group">
        {reasons.map((r) => (
          <button key={r} type="button" className="toggle toggle-sm" aria-pressed={value === r} onClick={() => actions.setReason(qid, r)}>
            {t.app.reasons[r]}
          </button>
        ))}
      </div>
    </div>
  );
}
