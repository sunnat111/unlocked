'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { fmt } from '@/lib/i18n';
import { satDates } from '@/lib/config';
import { formatDate } from '@/lib/dates';

export function DateList() {
  const { locale, t } = useI18n();
  const d = t.dates;
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const f = (x: string, long = true) => formatDate(x, locale, { short: !long });
  const dayMs = 86400000;
  const list = satDates.filter((x) => now === null || new Date(x.date + 'T23:59:59').getTime() >= now);
  const nextDate = list[0]?.date;
  if (!list.length) return <p>{d.past}</p>;
  return (
    <div className="date-list">
      {list.map((x) => {
        const days = now ? Math.ceil((new Date(x.date + 'T08:00:00').getTime() - now) / dayMs) : null;
        const open = now ? new Date(x.regDeadline + 'T23:59:59').getTime() >= now : true;
        return (
          <div key={x.date} className={`date-row${x.date === nextDate ? ' is-next' : ''}`}>
            <div>
              <p className="caption">{d.test}</p>
              <p className="date-main">{f(x.date)}</p>
            </div>
            <div>
              <p className="caption">{d.deadline}</p>
              <p>{f(x.regDeadline, false)}</p>
              <span className={`chip ${open ? 'chip-open' : 'chip-closed'}`}>{open ? d.open : d.closed}</span>
            </div>
            <div>{days !== null && <p className="date-days">{fmt(d.daysLeft, { n: days })}</p>}</div>
            <Link href={`/${locale}/app/`} className="btn btn-ghost btn-sm">{d.planCta} <span className="arrow" aria-hidden>→</span></Link>
          </div>
        );
      })}
    </div>
  );
}
