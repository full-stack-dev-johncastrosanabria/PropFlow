import { useTranslation } from 'react-i18next';
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar';

interface Props {
  occupied: number;
  available: number;
  maintenance: number;
  rate: number;
}

// Occupancy as an inked gauge ring + a ruled legend.
export default function OccupancyDonut({ occupied, available, maintenance, rate }: Props) {
  const { t } = useTranslation();
  const segments = [
    { key: 'dashboard.segOccupied', value: occupied, ink: 'var(--color-ink-green)', form: 'solid' as const },
    { key: 'dashboard.segAvailable', value: available, ink: 'var(--color-ink-blue)', form: 'solid' as const },
    { key: 'dashboard.segMaintenance', value: maintenance, ink: 'var(--color-ink-amber-stroke)', form: 'dashed' as const },
  ];

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
      <div className="relative">
        <AnimatedCircularProgressBar
          value={rate}
          gaugePrimaryColor="var(--color-ink-green)"
          gaugeSecondaryColor="var(--color-rule)"
          className="size-[150px] text-[15px]"
        >
          <div className="text-center">
            <div className="text-figure text-[26px] font-semibold leading-none text-carbon">{rate}%</div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-carbon-faint">
              {t('dashboard.occupiedCap')}
            </div>
          </div>
        </AnimatedCircularProgressBar>
      </div>

      <ul className="w-full max-w-[220px] space-y-0">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-3 border-b border-rule py-2.5 last:border-b-0">
            <span
              className="h-[6px] w-7 rounded-full"
              style={
                s.form === 'dashed'
                  ? { backgroundImage: `repeating-linear-gradient(90deg, ${s.ink} 0 5px, transparent 5px 8px)` }
                  : { backgroundColor: s.ink }
              }
              aria-hidden
            />
            <span className="flex-1 text-[13.5px] font-semibold text-carbon-soft">{t(s.key)}</span>
            <span className="text-figure text-[15px] font-semibold text-carbon">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
