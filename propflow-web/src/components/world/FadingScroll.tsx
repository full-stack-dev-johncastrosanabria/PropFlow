import { useEffect, useRef, useState, type ReactNode } from 'react';

import { ProgressiveBlur } from '@/components/magicui/progressive-blur';
import { cn } from '@/lib/utils';

interface FadingScrollProps {
  children: ReactNode;
  /** outer positioning wrapper */
  className?: string;
  /** the scroll container itself — put max-height here */
  innerClassName?: string;
  fadeHeight?: string;
}

// A ruled sheet's scroll region: long content fades progressively into paper at
// the bottom edge; short content never sees the blur.
export function FadingScroll({ children, className, innerClassName, fadeHeight = '48px' }: FadingScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  const check = () => {
    const el = ref.current;
    if (el) setScrollable(el.scrollHeight > el.clientHeight + 4);
  };

  useEffect(check);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // watch the capped container, its content's size, and its DOM changes —
    // feeds like the activity list grow item-by-item after mount
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div ref={ref} className={cn('overflow-y-auto overscroll-contain', innerClassName)}>
        {children}
      </div>
      {scrollable && <ProgressiveBlur position="bottom" height={fadeHeight} />}
    </div>
  );
}
