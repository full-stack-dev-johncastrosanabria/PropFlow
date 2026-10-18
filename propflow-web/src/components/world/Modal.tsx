import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

// A sheet lifted off the planner — the only interruption the world allows.
export function Modal({ title, subtitle, onClose, children, wide }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('input,select,textarea,button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'max-h-[92vh] w-full overflow-y-auto rounded-t-sheet border border-rule bg-paper-raised shadow-sheet-lift sm:rounded-sheet',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        )}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-rule bg-paper-raised px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-carbon">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-carbon-faint">{subtitle}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
            <X className="size-4.5" />
          </Button>
        </header>
        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
