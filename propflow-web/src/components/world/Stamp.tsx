import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type StampTone = 'red' | 'green' | 'amber' | 'blue' | 'carbon';

const STAMP_TONES: Record<StampTone, string> = {
  red: 'border-ink-red text-ink-red',
  green: 'border-ink-green text-ink-green',
  amber: 'border-ink-amber-stroke text-ink-amber',
  blue: 'border-ink-blue text-ink-blue',
  carbon: 'border-carbon-faint text-carbon-soft',
};

interface StampProps {
  tone?: StampTone;
  children: ReactNode;
  className?: string;
  /** slight rotation reads as hand-stamped; pass false to keep it straight */
  rotate?: boolean;
}

// A rubber stamp pressed onto the sheet — loud states only.
export function Stamp({ tone = 'red', children, className, rotate = true }: StampProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[4px] border-[1.5px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.11em] select-none',
        STAMP_TONES[tone],
        rotate && '-rotate-[1.2deg]',
        className
      )}
    >
      {children}
    </span>
  );
}

export type BadgeTone = 'red' | 'green' | 'amber' | 'blue' | 'carbon';

const BADGE_TONES: Record<BadgeTone, string> = {
  red: 'border-ink-red/40 bg-ink-red/10 text-ink-red-deep',
  green: 'border-ink-green/40 bg-ink-green/10 text-ink-green-deep',
  amber: 'border-ink-amber-stroke/50 bg-ink-amber-stroke/15 text-ink-amber',
  blue: 'border-ink-blue/40 bg-ink-blue/10 text-ink-blue-deep',
  carbon: 'border-rule-strong bg-paper-deep text-carbon-soft',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
  /** state-as-form leading stroke: solid = settled, dashed = waiting */
  stroke?: 'solid' | 'dashed' | 'none';
}

// Quiet status chip — the ink tone with a state stroke, not a shout.
export function Badge({ tone = 'carbon', children, className, stroke = 'none' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-xs font-semibold',
        BADGE_TONES[tone],
        className
      )}
    >
      {stroke !== 'none' && (
        <span
          aria-hidden
          className={cn('h-[2px] w-3 rounded-full', tone === 'amber' ? 'bg-ink-amber-stroke' : 'bg-current')}
          style={
            stroke === 'dashed'
              ? { backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 3px, transparent 3px 5px)' }
              : undefined
          }
        />
      )}
      {children}
    </span>
  );
}
