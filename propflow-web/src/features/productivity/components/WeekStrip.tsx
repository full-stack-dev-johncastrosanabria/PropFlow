import { i18n } from '@/i18n';
import type { DayPointDto } from '../../../shared/types';

interface Props {
  days: DayPointDto[];
  goalHours: number;
}

// 7-day lead-gen block strip: ink stroke height = hours, dashed rule = goal.
export default function WeekStrip({ days, goalHours }: Props) {
  const locale = i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US';
  const max = Math.max(goalHours, ...days.map((d) => d.leadGenHours), 1);

  return (
    <div className="grid grid-cols-7 gap-2 sm:gap-4">
      {days.map((d, i) => {
        const h = (d.leadGenHours / max) * 100;
        const goalLine = (goalHours / max) * 100;
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="relative h-[110px] w-full max-w-[54px]">
              {/* goal line — dashed rule across the sheet */}
              <div
                className="absolute inset-x-0 z-10 h-[2px]"
                style={{
                  bottom: `${goalLine}%`,
                  backgroundImage:
                    'repeating-linear-gradient(90deg, var(--color-carbon-soft) 0 4px, transparent 4px 7px)',
                }}
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 top-0 rounded-[6px] border border-rule/70 bg-graph-dots bg-paper-well/50" />
              {/* the day's ink stroke */}
              <div
                className={`absolute inset-x-[26%] bottom-0 rounded-t-[5px] transition-all ${
                  d.blockDone ? 'bg-ink-green' : 'bg-ink-amber-stroke/70'
                }`}
                style={{ height: `${Math.max(2.5, h)}%` }}
                title={`${d.leadGenHours}h · ${d.contacts} ${i18n.t('prod.contacts')}`}
              />
            </div>
            <span className="text-figure text-[12px] font-semibold text-carbon">
              {d.leadGenHours > 0 ? `${d.leadGenHours}h` : '–'}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-carbon-faint">{new Date(d.date).toLocaleDateString(locale, { weekday: 'short' })}</span>
          </div>
        );
      })}
    </div>
  );
}
