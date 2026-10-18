import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

interface PanelProps {
  title?: string;
  hint?: string;
  /** right-aligned header action — a link or button */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, hint, action, children, className, bodyClassName }: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-sheet border border-rule bg-paper-raised shadow-sheet',
        className
      )}
    >
      {(title || action) && (
        <header className="flex min-h-[52px] items-center justify-between gap-3 border-b border-rule px-5 py-3 sm:px-6">
          <div className="flex min-w-0 items-baseline gap-3">
            {title && (
              <h2 className="font-display text-[17px] font-semibold text-carbon">{title}</h2>
            )}
            {hint && (
              <span className="hidden truncate text-[13px] text-carbon-faint sm:block">{hint}</span>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn('p-5 sm:p-6', bodyClassName)}>{children}</div>
    </section>
  );
}

export function PanelLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 rounded-[6px] text-[13.5px] font-semibold text-ink-blue underline-offset-[3px] hover:underline"
    >
      {children}
    </Link>
  );
}
