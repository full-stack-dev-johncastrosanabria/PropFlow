import type { MonthlyRevenueDto } from '../../../shared/types';
import { money } from '../dashboardUtils';

interface Props {
  data: MonthlyRevenueDto[];
  currency: string;
}

// Lightweight SVG column chart: collected (solid) vs expected (track).
export default function RevenueChart({ data, currency }: Props) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.expected, d.collected)));
  const W = 520;
  const H = 200;
  const padB = 28;
  const padT = 12;
  const chartH = H - padB - padT;
  const slot = W / data.length;
  const barW = Math.min(38, slot * 0.5);

  return (
    <div className="rev-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="rev-chart-svg" role="img" aria-label="Revenue trend">
        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={0}
            x2={W}
            y1={padT + chartH * (1 - g)}
            y2={padT + chartH * (1 - g)}
            className="rev-grid"
          />
        ))}
        {data.map((d, i) => {
          const cx = i * slot + slot / 2;
          const expH = (d.expected / max) * chartH;
          const colH = (d.collected / max) * chartH;
          return (
            <g key={i}>
              {/* expected track */}
              <rect
                x={cx - barW / 2}
                y={padT + chartH - expH}
                width={barW}
                height={Math.max(expH, 2)}
                rx={5}
                className="rev-bar-track"
              />
              {/* collected fill */}
              <rect
                x={cx - barW / 2}
                y={padT + chartH - colH}
                width={barW}
                height={Math.max(colH, 2)}
                rx={5}
                className="rev-bar-fill"
              />
              <text x={cx} y={H - 9} textAnchor="middle" className="rev-x-label">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="rev-legend">
        <span className="rev-legend-item"><span className="rev-dot rev-dot-fill" /> Collected</span>
        <span className="rev-legend-item"><span className="rev-dot rev-dot-track" /> Expected</span>
        <span className="rev-legend-total">
          Last 6 mo: <strong>{money(data.reduce((s, d) => s + d.collected, 0), currency, true)}</strong>
        </span>
      </div>
    </div>
  );
}
