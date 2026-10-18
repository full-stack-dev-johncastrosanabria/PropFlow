import type { ReactNode } from 'react';

// The top of every working page: what this sheet is, and the one action that matters.
export function PageHeader({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-[30px] font-bold leading-tight text-carbon sm:text-[34px]">
          {title}
        </h1>
        <p className="mt-1 max-w-[62ch] text-[15px] text-carbon-soft">{copy}</p>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2.5">{action}</div>}
    </div>
  );
}
