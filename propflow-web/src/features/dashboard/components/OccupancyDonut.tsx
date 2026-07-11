interface Props {
  occupied: number;
  available: number;
  maintenance: number;
  rate: number;
}

const COLORS = {
  occupied: '#22c55e',
  available: '#3b82f6',
  maintenance: '#f59e0b',
};

export default function OccupancyDonut({ occupied, available, maintenance, rate }: Props) {
  const total = occupied + available + maintenance;
  const segments = [
    { key: 'Occupied', value: occupied, color: COLORS.occupied },
    { key: 'Available', value: available, color: COLORS.available },
    { key: 'Maintenance', value: maintenance, color: COLORS.maintenance },
  ];

  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <div className="donut-svg-wrap">
        <svg viewBox="0 0 140 140" className="donut-svg">
          <circle cx="70" cy="70" r={r} className="donut-track" />
          {total > 0 &&
            segments.map((s) => {
              const len = (s.value / total) * c;
              const dash = `${len} ${c - len}`;
              const el = (
                <circle
                  key={s.key}
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="16"
                  strokeDasharray={dash}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  transform="rotate(-90 70 70)"
                />
              );
              offset += len;
              return el;
            })}
          <text x="70" y="66" textAnchor="middle" className="donut-center-value">{rate}%</text>
          <text x="70" y="86" textAnchor="middle" className="donut-center-label">occupied</text>
        </svg>
      </div>
      <div className="donut-legend">
        {segments.map((s) => (
          <div key={s.key} className="donut-legend-row">
            <span className="donut-legend-dot" style={{ background: s.color }} />
            <span className="donut-legend-label">{s.key}</span>
            <span className="donut-legend-value">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
