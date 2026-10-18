import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon,
  title,
  copy,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-sheet border border-dashed border-rule-strong bg-paper-well/60 px-6 py-14 text-center',
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full border border-rule-strong bg-paper-raised text-carbon-soft">
        <Icon className="size-5" aria-hidden />
      </div>
      <div>
        <h3 className="font-display text-[16px] font-semibold text-carbon">{title}</h3>
        <p className="mt-1 max-w-sm text-[14px] text-carbon-soft">{copy}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export function PageLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-carbon-soft">
        <span className="relative flex size-4">
          <span className="absolute inline-flex size-full animate-ping rounded-full border-2 border-ink-red opacity-60" />
          <span className="relative inline-flex size-4 rounded-full border-2 border-ink-red" />
        </span>
        <span className="text-[15px] font-medium">{label}</span>
      </div>
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn('h-4 animate-pulse rounded bg-paper-deep', className)} />;
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-[9px] border-[1.5px] border-ink-red/70 bg-ink-red/8 px-4 py-3 text-[14.5px] font-medium text-ink-red-deep"
    >
      {message}
    </div>
  );
}
