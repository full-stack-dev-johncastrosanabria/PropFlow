import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const controlCls =
  'w-full rounded-[9px] border border-rule-strong bg-paper-raised px-3.5 py-2.5 text-[15px] text-carbon placeholder:text-carbon-faint transition-colors hover:border-rule-strong/80 focus:border-ink-blue focus:outline-none focus:ring-2 focus:ring-ink-blue/25 disabled:cursor-not-allowed disabled:opacity-60';

const errorCls = 'border-ink-red/70 focus:border-ink-red focus:ring-ink-red/20';

export function Field({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[13px] font-semibold text-carbon-soft">
        {label}
        {required && <span className="ml-0.5 text-ink-red" aria-hidden>*</span>}
      </label>
      {children}
      {error && <span className="text-[13px] font-medium text-ink-red">{error}</span>}
    </div>
  );
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input ref={ref} className={cn(controlCls, invalid && errorCls, className)} {...props} />
));
TextInput.displayName = 'TextInput';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea ref={ref} className={cn(controlCls, 'min-h-[80px] resize-y', invalid && errorCls, className)} {...props} />
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(controlCls, 'appearance-none pr-9', invalid && errorCls, className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-carbon-faint"
      aria-hidden
    />
  </div>
));
Select.displayName = 'Select';
