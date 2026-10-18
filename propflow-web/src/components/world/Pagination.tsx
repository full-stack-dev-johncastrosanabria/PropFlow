import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}

// The ledger's page footer — "1–12 of 38", ruled buttons, no theatrics.
export function Pagination({ page, pageSize, total, onPageChange, label }: PaginationProps) {
  const { t } = useTranslation();
  const itemsLabel = label ?? t('common.items');
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const safePage = Math.min(page, totalPages);
  const from = (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);

  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (safePage > 3) pages.push('…');
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  return (
    <nav
      aria-label={t('common.pagination')}
      className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-5 py-3 sm:px-6"
    >
      <span className="text-figure text-[12.5px] text-carbon-soft">
        {t('common.rangeOf', { from, to, total, label: itemsLabel })}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage === 1}
          aria-label={t('common.prevPage')}
          className="flex size-8 items-center justify-center rounded-[8px] text-carbon-soft transition-colors hover:bg-paper-well hover:text-carbon disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-1 text-[13px] text-carbon-faint" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === safePage ? 'page' : undefined}
              className={cn(
                'text-figure flex size-8 items-center justify-center rounded-[8px] text-[13px] transition-colors',
                p === safePage
                  ? 'bg-paper-deep font-semibold text-carbon shadow-tab'
                  : 'text-carbon-soft hover:bg-paper-well hover:text-carbon'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage === totalPages}
          aria-label={t('common.nextPage')}
          className="flex size-8 items-center justify-center rounded-[8px] text-carbon-soft transition-colors hover:bg-paper-well hover:text-carbon disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
