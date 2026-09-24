'use client';

import type { RefObject } from 'react';
import { cn } from '@/components/ui/cn';

/** Page numbers to show: always the first and last, the current page and its neighbours. */
function pageList(page: number, pageCount: number): (number | 'gap')[] {
  const shown = new Set([1, pageCount, page - 1, page, page + 1]);
  const out: (number | 'gap')[] = [];
  for (let p = 1; p <= pageCount; p++) {
    if (!shown.has(p)) continue;
    const prev = out[out.length - 1];
    if (typeof prev === 'number' && p - prev > 1) out.push('gap');
    out.push(p);
  }
  return out;
}

// Bring the top of the list back into view after a page change. Lenis owns the scroll position
// when it is running, so it has to do the scrolling; native scrolling is the fallback.
function scrollToList(target: HTMLElement | null) {
  if (!target) return;
  const header =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 56;
  const offset = -(header + 24);
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset });
    return;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY + offset,
    behavior: reduced ? 'auto' : 'smooth',
  });
}

/**
 * Shared pager for the work archives (design case studies and films). Renders nothing for a
 * single page. `scrollTargetRef` is the element brought back into view when the page changes.
 */
export function Pagination({
  page,
  pageCount,
  start,
  end,
  total,
  noun,
  onPageChange,
  scrollTargetRef,
  className,
}: {
  page: number;
  pageCount: number;
  start: number;
  end: number;
  total: number;
  /** Plural noun for the range readout, e.g. "projects". */
  noun: string;
  onPageChange: (page: number) => void;
  scrollTargetRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const go = (next: number) => {
    if (next === page || next < 1 || next > pageCount) return;
    onPageChange(next);
    scrollToList(scrollTargetRef.current);
  };

  const step =
    'inline-flex h-10 items-center rounded-full border px-4 font-sans text-sm font-medium transition-colors duration-300';
  const idle = 'border-white/15 text-white/70 hover-fine:hover:border-white/30 hover-fine:hover:text-white';
  const disabled = 'cursor-default border-white/8 text-white/25';

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-col items-center gap-4 sm:flex-row sm:justify-between', className)}
    >
      <p className="font-sans text-sm text-white/45" aria-live="polite">
        <span className="tabular-nums text-white/70">
          {start}–{end}
        </span>{' '}
        of <span className="tabular-nums text-white/70">{total}</span> {noun}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className={cn(step, page === 1 ? disabled : idle)}
        >
          Previous
        </button>

        <ol className="hidden items-center gap-1.5 sm:flex">
          {pageList(page, pageCount).map((p, i) =>
            p === 'gap' ? (
              <li key={`gap-${i}`} aria-hidden className="px-1 text-sm text-white/30">
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => go(p)}
                  aria-current={p === page ? 'page' : undefined}
                  aria-label={`Page ${p}`}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full border font-sans text-sm font-medium tabular-nums transition-colors duration-300',
                    p === page ? 'border-white/40 bg-white/10 text-white' : idle,
                  )}
                >
                  {p}
                </button>
              </li>
            ),
          )}
        </ol>
        <p className="px-2 font-sans text-sm tabular-nums text-white/60 sm:hidden">
          {page} / {pageCount}
        </p>

        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page === pageCount}
          className={cn(step, page === pageCount ? disabled : idle)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
