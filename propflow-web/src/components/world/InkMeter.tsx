import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

export type InkTone = 'red' | 'green' | 'blue' | 'amber' | 'carbon';

// State carried in form, not hue alone — the emission-rail discipline, inked:
// solid = live, dashed = overdue, half = pending, doubled = won.
export type InkForm = 'solid' | 'dashed' | 'half' | 'doubled';

const TONE_INK: Record<InkTone, string> = {
  red: 'var(--color-ink-red)',
  green: 'var(--color-ink-green)',
  blue: 'var(--color-ink-blue)',
  amber: 'var(--color-ink-amber-stroke)',
  carbon: 'var(--color-carbon-soft)',
};

interface InkMeterProps {
  /** actual amount, in the same units as goal */
  value: number;
  /** the target — draws the dashed goal tick */
  goal?: number;
  /** scale cap; defaults to goal */
  max?: number;
  tone?: InkTone;
  form?: InkForm;
  thin?: boolean;
  className?: string;
  /** delay in seconds for the entrance spring */
  delay?: number;
}

export function InkMeter({
  value,
  goal,
  max,
  tone = 'green',
  form = 'solid',
  thin,
  className,
  delay = 0,
}: InkMeterProps) {
  const cap = Math.max(max ?? goal ?? value, value, 0.0001);
  const fillPct = Math.max(0, Math.min(100, (value / cap) * 100));
  const tickPct = goal != null && goal <= cap ? Math.min(100, (goal / cap) * 100) : null;
  const ink = TONE_INK[tone];
  const height = thin ? 'h-[3px]' : 'h-[6px]';

  const fillStyle: React.CSSProperties =
    form === 'dashed'
      ? {
          backgroundImage: `repeating-linear-gradient(115deg, ${ink} 0 5px, transparent 5px 9px)`,
        }
      : { backgroundColor: ink };

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fillPct)}
      aria-label={`${Math.round(fillPct)} percent`}
      className={cn('relative w-full', height, className)}
    >
      {/* ruled track */}
      <div className="absolute inset-0 rounded-full bg-rule/70" />

      {/* actual stroke */}
      <motion.div
        className={cn(
          'absolute inset-y-0 left-0 rounded-full',
          form === 'half' && 'opacity-45',
          form === 'doubled' && 'inset-y-[-3px]'
        )}
        style={fillStyle}
        initial={{ width: 0 }}
        whileInView={{ width: `${fillPct}%` }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: 'spring', stiffness: 90, damping: 20, delay }}
      />

      {/* the doubled line — a second stroke slightly offset, like a ballpoint pass */}
      {form === 'doubled' && (
        <motion.div
          className="absolute left-0 h-[2px] translate-y-[5px] rounded-full"
          style={{ backgroundColor: ink }}
          initial={{ width: 0 }}
          whileInView={{ width: `${fillPct}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: delay + 0.08 }}
        />
      )}

      {/* dashed goal tick — only when the goal sits inside the scale */}
      {tickPct != null && tickPct < 99 && (
        <div
          className="absolute -top-[3px] bottom-[-3px] w-[2px]"
          style={{
            left: `${tickPct}%`,
            backgroundImage: `repeating-linear-gradient(to bottom, var(--color-carbon-soft) 0 3px, transparent 3px 6px)`,
          }}
          aria-hidden
        />
      )}
    </div>
  );
}
