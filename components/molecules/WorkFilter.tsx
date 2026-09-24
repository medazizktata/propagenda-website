'use client';

import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/components/ui/cn';

export interface FilterAxis {
  id: string;
  /** Sentence-case heading for the chip group, e.g. "Sector". */
  label: string;
  options: readonly string[];
}

/** Selected value per axis id; a missing or null entry means "All". */
export type FilterValues = Record<string, string | null | undefined>;

/** True when `item` passes every active axis. `get` reads an item's value for an axis. */
export function matchesFilters<T>(
  item: T,
  values: FilterValues,
  get: (item: T, axisId: string) => string | null | undefined,
) {
  return Object.entries(values).every(([axis, selected]) => !selected || get(item, axis) === selected);
}

/** Stable key for a filter set, e.g. to reset paging or replay a grid entrance. */
export function filterKey(values: FilterValues) {
  return Object.keys(values)
    .sort()
    .map((k) => `${k}=${values[k] ?? ''}`)
    .join('|');
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 font-sans text-sm font-medium transition-colors duration-300',
        active
          ? 'border-orange bg-orange text-ink'
          : 'border-white/15 text-white/70 hover-fine:hover:border-white/30 hover-fine:hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

/**
 * The one filter control for both work archives (design case studies and films): a Filter
 * button carrying the active-axis count, opening a popover of chip groups — one per axis, the
 * axes AND together. Closed by default so the archive leads with the work, not the controls.
 */
export function WorkFilter({
  axes,
  values,
  onChange,
  onReset,
  resultCount,
  noun,
  dialogLabel,
}: {
  axes: FilterAxis[];
  values: FilterValues;
  onChange: (axisId: string, value: string | null) => void;
  onReset: () => void;
  resultCount: number;
  /** [singular, plural], e.g. ["project", "projects"]. */
  noun: [string, string];
  dialogLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeCount = axes.filter((a) => values[a.id]).length;

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const visibleAxes = axes.filter((a) => a.options.length > 0);

  return (
    <div className="flex shrink-0 items-center gap-4">
      <p className="font-sans text-sm text-white/45">
        <span className="tabular-nums text-white/70">{resultCount}</span>{' '}
        {resultCount === 1 ? noun[0] : noun[1]}
      </p>

      <div ref={rootRef} className="relative z-40">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            'flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm font-medium transition-colors duration-300',
            activeCount > 0 || open
              ? 'border-white/35 text-white'
              : 'border-white/15 text-white/70 hover-fine:hover:border-white/30 hover-fine:hover:text-white',
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filter
          {activeCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-xs font-bold tabular-nums text-ink">
              {activeCount}
            </span>
          ) : null}
        </button>

        {open ? (
          <div
            role="dialog"
            aria-label={dialogLabel}
            className="work-filter-pop fixed inset-x-4 bottom-4 z-50 max-h-[78vh] origin-bottom overflow-y-auto rounded-2xl border border-white/10 bg-[#2b2b2b] p-5 shadow-2xl shadow-black/60 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-3 sm:max-h-[min(70vh,34rem)] sm:w-[min(90vw,26rem)] sm:origin-top-right"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans text-base font-semibold text-white">Filter</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="flex size-8 items-center justify-center rounded-full text-white/50 transition-colors hover-fine:hover:bg-white/10 hover-fine:hover:text-white"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="space-y-5">
              {visibleAxes.map((axis) => (
                <div key={axis.id}>
                  <p className="mb-2.5 font-sans text-sm text-white/45">{axis.label}</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label={`Filter by ${axis.label.toLowerCase()}`}>
                    <Chip active={!values[axis.id]} onClick={() => onChange(axis.id, null)}>
                      All
                    </Chip>
                    {axis.options.map((option) => (
                      <Chip
                        key={option}
                        active={values[axis.id] === option}
                        onClick={() => onChange(axis.id, option)}
                      >
                        {option}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={onReset}
                disabled={activeCount === 0}
                className={cn(
                  'font-sans text-sm font-medium transition-colors',
                  activeCount > 0 ? 'text-white/70 hover-fine:hover:text-orange' : 'cursor-default text-white/25',
                )}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-orange px-5 py-2 font-sans text-sm font-semibold text-ink transition-transform duration-200 hover-fine:hover:-translate-y-0.5"
              >
                Show {resultCount}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .work-filter-pop { animation: workFilterPop 0.16s ease-out; }
        }
        @keyframes workFilterPop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
