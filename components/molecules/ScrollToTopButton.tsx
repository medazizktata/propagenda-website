'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { scrollToTopSmooth } from '@/lib/motion/scrollToTop';
import { cn } from '@/components/ui/cn';

type ScrollToTopButtonProps = {
  className?: string;
  /** Pin to viewport corner — shown after scrolling down. */
  fixed?: boolean;
};

export function ScrollToTopButton({ className, fixed = false }: ScrollToTopButtonProps) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(!fixed);

  useEffect(() => {
    if (!fixed) return;

    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [fixed]);

  if (fixed && !visible) return null;

  return (
    <button
      type="button"
      onClick={() => scrollToTopSmooth({ instant: reducedMotion })}
      className={cn(
        'transition-hover inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange text-navy shadow-md',
        'hover-fine:hover:bg-orange-hover hover-fine:hover:scale-105',
        fixed &&
          'fixed bottom-6 right-gutter-m z-50 shadow-lg ring-1 ring-black/20 lg:right-gutter-d',
        className,
      )}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
