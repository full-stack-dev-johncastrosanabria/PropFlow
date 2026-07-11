import type { DayPointDto } from '../../../shared/types';

interface Props {
  days: DayPointDto[];
  goalHours: number;
}

// 7-day lead-gen block strip: bar height = hours, green when the block was done.
export default function WeekStrip({ days, goalHours }: Props) {
  const max = Math.max(goalHours, ...days.map((d) => d.leadGenHours), 1);

  return (
    <div className="week-strip">
      {days.map((d, i) => {
        const h = (d.leadGenHours / max) * 100;
        const goalLine = (goalHours / max) * 100;
        return (
          <div key={i} className="week-col">
            <div className="week-bar-area">
              <div className="week-goal-line" style={{ bottom: `${goalLine}%` }} />
              <div
                className={`week-bar ${d.blockDone ? 'week-bar-done' : ''}`}
                style={{ height: `${Math.max(3, h)}%` }}
                title={`${d.leadGenHours}h · ${d.contacts} contacts`}
              />
            </div>
            <div className="week-hours">{d.leadGenHours > 0 ? `${d.leadGenHours}h` : '–'}</div>
            <div className="week-label">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}
