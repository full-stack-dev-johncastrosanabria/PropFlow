import type { MonthlyRevenueDto } from '../../../shared/types';
import { useTranslation } from 'react-i18next';
import { money } from '../dashboardUtils';

interface Props {
  data: MonthlyRevenueDto[];
  currency: string;
}

// Inked column chart on graph paper: collected (solid ink) vs expected (ruled track).
export default function RevenueChart({ data, currency }: Props) {
  const { t } = useTranslation();
  const max = Math.max(1, ...data.map((d) => Math.max(d.expected, d.collected)));
  const W = 520;
  const H = 210;
  const padB = 30;
  const padT = 10;
  const chartH = H - padB - padT;
  const slot = W / data.length;
  const barW = Math.min(40, slot * 0.52);

  return (
    <div>
      <div className="bg-graph-dots rounded-[10px] border border-rule/70 bg-paper-well/50 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t("dashboard.revenueAria")}>
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1={0}
              x2={W}
              y1={padT + chartH * (1 - g)}
              y2={padT + chartH * (1 - g)}
              stroke="var(--color-rule)"
              strokeWidth={1}
              strokeDasharray="2 5"
            />
          ))}
          {data.map((d, i) => {
            const cx = i * slot + slot / 2;
            const expH = Math.max((d.expected / max) * chartH, 2);
            const colH = Math.max((d.collected / max) * chartH, 2);
            const isCurrent = i === data.length - 1;
            return (
              <g key={i}>
                {/* expected — the ruled track */}
                <rect
                  x={cx - barW / 2}
                  y={padT + chartH - expH}
                  width={barW}
                  height={expH}
                  rx={6}
                  fill="var(--color-paper-raised)"
                  stroke="var(--color-rule-strong)"
                  strokeWidth={1.25}
                />
                {/* collected — the ink stroke */}
                <rect
                  x={cx - barW / 2}
                  y={padT + chartH - colH}
                  width={barW}
                  height={colH}
                  rx={6}
                  fill={isCurrent ? 'var(--color-ink-red-bright)' : 'var(--color-ink-green)'}
                  opacity={isCurrent ? 1 : 0.92}
                />
                {isCurrent && (
                  <rect
                    x={cx - barW / 2}
                    y={padT + chartH - colH}
                    width={barW}
                    height={colH}
                    rx={6}
                    fill="none"
                    stroke="var(--color-ink-red-deep)"
                    strokeWidth={1.25}
                  />
                )}
                <text x={cx} y={H - 9} textAnchor="middle" fontSize={12.5} fill="var(--color-carbon-soft)" fontWeight={600}>
                  {t(`common.months.${d.month.toLowerCase()}`)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1">
        <div className="flex items-center gap-5 text-[13px] font-medium text-carbon-soft">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-[3px] bg-ink-green" aria-hidden /> {t("dashboard.legendCollected")}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-[3px] border border-rule-strong bg-paper-raised" aria-hidden /> {t("dashboard.legendExpected")}
          </span>
        </div>
        <span className="text-[13px] text-carbon-faint">
          {t('dashboard.last6Label')}{' '}
          <span className="text-figure font-semibold text-carbon">
            {money(data.reduce((s, d) => s + d.collected, 0), currency, true)}
          </span>
        </span>
      </div>
    </div>
  );
}
