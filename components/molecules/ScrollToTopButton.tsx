'use client';

import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

export function ScrollToTopButton({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }}
      className={cn(
        'transition-hover inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange text-navy shadow-md',
        'hover-fine:hover:bg-orange-hover hover-fine:hover:scale-105',
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
