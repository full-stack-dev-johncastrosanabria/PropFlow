import type { ActivityTotalsDto } from '../../../shared/types';

interface Props {
  totals: ActivityTotalsDto;
}

// KW Economic Model: the funnel from contacts down to closed business,
// with conversion rates between each stage. Computed over the last 30 days.
export default function EconomicModel({ totals }: Props) {
  const stages = [
    { label: 'Contacts', value: totals.contacts, color: '#2563eb' },
    { label: 'Conversations', value: totals.conversations, color: '#0ea5e9' },
    { label: 'Appointments', value: totals.appointmentsMet, color: '#f59e0b' },
    { label: 'Agreements', value: totals.agreementsSigned, color: '#7c3aed' },
    { label: 'Offers Written', value: totals.offersWritten, color: '#22c55e' },
  ];
  const max = Math.max(1, ...stages.map((s) => s.value));

  const conv = (from: number, to: number) =>
    from > 0 ? Math.round((to / from) * 100) : 0;

  return (
    <div className="econ">
      {stages.map((s, i) => (
        <div key={s.label} className="econ-stage">
          <div className="econ-row">
            <span className="econ-label">{s.label}</span>
            <div className="econ-bar-wrap">
              <div
                className="econ-bar"
                style={{ width: `${Math.max(6, (s.value / max) * 100)}%`, background: s.color }}
              >
                <span className="econ-value">{s.value}</span>
              </div>
            </div>
          </div>
          {i < stages.length - 1 && (
            <div className="econ-conv">
              <span className="econ-conv-arrow">↓</span>
              <span className="econ-conv-pct">{conv(s.value, stages[i + 1].value)}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
