import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[9px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        primary:
          'bg-ink-red text-[#fdf8ec] border border-ink-red-deep/60 hover:bg-ink-red-bright active:translate-y-px',
        secondary:
          'bg-paper-raised text-carbon border border-rule-strong hover:bg-paper-deep active:translate-y-px',
        ghost: 'text-carbon-soft hover:bg-paper-deep hover:text-carbon',
        danger:
          'bg-paper-raised text-ink-red border border-ink-red/45 hover:bg-ink-red/10',
        link: 'text-ink-blue underline underline-offset-[3px] hover:text-ink-blue-deep px-0',
      },
      size: {
        sm: 'h-9 px-3.5 text-[13.5px]',
        md: 'h-11 px-5 text-[15px]',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
