interface Props {
  value: number;
  goal: number;
  label: string;
  icon: string;
  color: string;
  unit?: string;
}

export default function ScoreRing({ value, goal, label, icon, color, unit }: Props) {
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const done = value >= goal && goal > 0;

  return (
    <div className="score-ring">
      <div className="score-ring-svg-wrap">
        <svg viewBox="0 0 84 84" className="score-ring-svg">
          <circle cx="42" cy="42" r={r} className="score-ring-track" />
          <circle
            cx="42"
            cy="42"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={c * 0.25}
            transform="rotate(-90 42 42)"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
          <text x="42" y="40" textAnchor="middle" className="score-ring-value">
            {value}{unit || ''}
          </text>
          <text x="42" y="55" textAnchor="middle" className="score-ring-goal">
            /{goal}{unit || ''}
          </text>
        </svg>
        {done && <span className="score-ring-check">✓</span>}
      </div>
      <div className="score-ring-label">
        <span className="score-ring-icon">{icon}</span> {label}
      </div>
    </div>
  );
}
