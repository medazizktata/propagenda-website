'use client';

import { cn } from '@/components/ui/cn';

interface ScrollCueProps {
  /** Accessible name when rendered as a button. */
  label?: string;
  onClick?: () => void;
  className?: string;
  /** Accent colour for the drifting hairline tip (defaults to brand orange). */
  tipClassName?: string;
}

/**
 * Quiet backstage scroll affordance — bottom-right, low contrast, label + hairline.
 * Prefer this over centred bounce chrome so the hero composition stays primary.
 */
export function ScrollCue({
  label = 'Scroll to continue',
  onClick,
  className,
  tipClassName = 'bg-orange',
}: ScrollCueProps) {
  const body = (
    <>
      <span className="text-backstage text-white/25">Scroll</span>
      <span aria-hidden className="relative h-9 w-px overflow-hidden bg-white/10">
        <span
          className={cn(
            'absolute inset-x-0 top-0 h-2.5 motion-safe:animate-[video-scan_2.2s_ease-in-out_infinite]',
            tipClassName,
          )}
        />
      </span>
    </>
  );

  const shell = cn(
    'absolute bottom-7 right-gutter-m z-content hidden items-center gap-2.5 opacity-70 md:flex lg:right-gutter-d',
    onClick
      ? 'pointer-events-auto min-h-11 px-1 transition-hover hover-fine:hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/25'
      : 'pointer-events-none',
    className,
  );

  if (onClick) {
    return (
      <button type="button" aria-label={label} onClick={onClick} className={shell}>
        {body}
      </button>
    );
  }

  return (
    <div aria-hidden className={shell}>
      {body}
    </div>
  );
}
