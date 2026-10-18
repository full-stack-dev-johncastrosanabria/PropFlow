import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar';
import { Check } from 'lucide-react';

interface Props {
  value: number;
  goal: number;
  label: string;
  color: string;
  unit?: string;
}

// The goal-vs-actual ring: ink stroke to actual, ruled track to goal.
export default function ScoreRing({ value, goal, label, color, unit }: Props) {
  const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  const done = value >= goal && goal > 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <AnimatedCircularProgressBar
          value={pct}
          max={100}
          gaugePrimaryColor={color}
          gaugeSecondaryColor="var(--color-rule)"
          className="size-[92px] text-[13px]"
        >
          <div className="text-center leading-none">
            <span className="text-figure text-[16px] font-semibold text-carbon">
              {value}{unit || ''}
            </span>
            <span className="text-figure block pt-0.5 text-[11px] text-carbon-faint">
              /{goal}{unit || ''}
            </span>
          </div>
        </AnimatedCircularProgressBar>
        {done && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-ink-green-deep bg-paper-raised text-ink-green">
            <Check className="size-3" strokeWidth={3} aria-label="Goal met" />
          </span>
        )}
      </div>
      <span className="text-center text-[12px] font-semibold text-carbon-soft">{label}</span>
    </div>
  );
}
