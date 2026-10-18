import { useTranslation } from 'react-i18next';
import type { ActivityTotalsDto } from '../../../shared/types';
import { ArrowDown } from 'lucide-react';

interface Props {
  totals: ActivityTotalsDto;
}

// KW Economic Model: the funnel from contacts down to closed business,
// with conversion rates between each stage. Computed over the last 30 days.
export default function EconomicModel({ totals }: Props) {
  const { t } = useTranslation();
  const stages = [
    { labelKey: 'prod.mContacts', value: totals.contacts, ink: 'var(--color-ink-blue)' },
    { labelKey: 'prod.mConversations', value: totals.conversations, ink: 'var(--color-hue-units)' },
    { labelKey: 'prod.appointments', value: totals.appointmentsMet, ink: 'var(--color-ink-amber-stroke)' },
    { labelKey: 'prod.agreements', value: totals.agreementsSigned, ink: 'var(--color-hue-tenants)' },
    { labelKey: 'prod.offers', value: totals.offersWritten, ink: 'var(--color-ink-green)' },
  ];
  const max = Math.max(1, ...stages.map((s) => s.value));

  const conv = (from: number, to: number) =>
    from > 0 ? Math.round((to / from) * 100) : 0;

  return (
    <div>
      {stages.map((s, i) => (
        <div key={s.labelKey}>
          <div className="grid grid-cols-[104px_1fr_auto] items-center gap-3 py-[7px]">
            <span className="text-[13px] font-semibold text-carbon-soft">{t(s.labelKey)}</span>
            <div className="relative h-[16px]">
              <div
                className="absolute inset-y-0 left-0 rounded-[5px]"
                style={{ width: `${Math.max(5, (s.value / max) * 100)}%`, backgroundColor: s.ink }}
              />
            </div>
            <span className="text-figure w-8 text-right text-[13.5px] font-semibold text-carbon">{s.value}</span>
          </div>
          {i < stages.length - 1 && (
            <div className="ml-[116px] flex items-center gap-1.5 text-[12px] text-carbon-faint">
              <ArrowDown className="size-3" aria-hidden />
              <span className="text-figure font-semibold text-carbon-soft">
                {conv(s.value, stages[i + 1].value)}%
              </span>
              <span>{t('prod.convert')}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
