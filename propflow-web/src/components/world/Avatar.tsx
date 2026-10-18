import { cn } from '@/lib/utils';

const TONE_BG: Record<string, string> = {
  red: 'bg-ink-red text-[#fdf8ec]',
  green: 'bg-ink-green text-[#f2f7f0]',
  blue: 'bg-ink-blue text-[#eef1f8]',
  amber: 'bg-ink-amber-stroke text-[#fdf8ec]',
  plum: 'bg-hue-tenants text-[#f8f1f6]',
  teal: 'bg-hue-units text-[#eef6f7]',
  carbon: 'bg-carbon-soft text-paper-raised',
};

const TONE_BY_CHAR = ['red', 'blue', 'green', 'amber', 'plum', 'teal'] as const;

export function Avatar({
  name,
  className,
  icon,
  src,
}: {
  name: string;
  className?: string;
  icon?: React.ReactNode;
  src?: string;
}) {
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join('') || '?';
  const tone = TONE_BY_CHAR[(name.charCodeAt(0) || 0) % TONE_BY_CHAR.length];

  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        className={cn(
          'shrink-0 rounded-full border border-rule-strong object-cover',
          className ?? 'size-9'
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold tracking-wide',
        TONE_BG[tone],
        className
      )}
    >
      {icon ?? initials}
    </span>
  );
}

export function DateStamp({ className }: { className?: string }) {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = now.getDate();
  const month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = now.getFullYear();

  return (
    <div
      className={cn(
        'inline-flex select-none items-stretch overflow-hidden rounded-[8px] border border-rule-strong bg-paper-raised shadow-tab',
        className
      )}
      aria-label={now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
    >
      <div className="flex flex-col items-center justify-center border-r border-rule-strong bg-paper-deep px-2.5 py-1.5">
        <span className="text-[10px] font-bold tracking-[0.08em] text-carbon-soft">{weekday}</span>
        <span className="text-figure text-[15px] font-semibold leading-tight text-carbon">{day}</span>
      </div>
      <div className="flex flex-col justify-center px-2.5 py-1.5">
        <span className="text-[10px] font-bold tracking-[0.08em] text-carbon-soft">{month}</span>
        <span className="text-figure text-[15px] font-semibold leading-tight text-carbon">{year}</span>
      </div>
    </div>
  );
}
