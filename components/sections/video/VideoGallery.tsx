'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { VideoCard } from '@/components/molecules/VideoCard';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import type { VideoProject } from '@/types/content';

const ALL = 'All';

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden className="h-4 w-4">
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
      <circle cx="15" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Compact chip group used inside the filter popover.
function FilterChips({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: readonly string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
        {[ALL, ...options].map((option) => {
          const isActive = active === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(option)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'border-orange bg-orange text-black'
                  : 'border-white/12 text-white/60 hover-fine:hover:border-white/30 hover-fine:hover:text-white',
              )}
            >
              {option === ALL ? 'All' : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// The filterable archive: all cuts show by default; filtering lives in a small popover behind a
// Filter icon. Both axes AND together. Grid remounts on filter change to replay a CSS-only entrance
// stagger (ends fully visible, so nothing can strand at opacity 0).
export function VideoGallery({
  projects,
  categories,
  clients,
  onOpen,
}: {
  projects: VideoProject[];
  categories: readonly string[];
  clients: readonly string[];
  onOpen: (project: VideoProject) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [category, setCategory] = useState<string>(ALL);
  const [client, setClient] = useState<string>(ALL);
  const [open, setOpen] = useState(false);

  // Only surface filter values that actually exist in the data.
  const cats = useMemo(
    () => categories.filter((c) => projects.some((p) => p.category === c)),
    [categories, projects],
  );
  const clis = useMemo(
    () => clients.filter((c) => projects.some((p) => p.client === c)),
    [clients, projects],
  );

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (category === ALL || p.category === category) &&
          (client === ALL || p.client === client),
      ),
    [projects, category, client],
  );

  const activeCount = (category !== ALL ? 1 : 0) + (client !== ALL ? 1 : 0);
  const isFiltered = activeCount > 0;
  const reset = () => {
    setCategory(ALL);
    setClient(ALL);
  };

  // Header reveal — established safe per-element pattern (fromTo → ends visible, once).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    registerGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.vg-reveal', { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.utils.toArray<HTMLElement>('.vg-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Close the popover on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 lg:py-24"
      aria-labelledby="video-gallery-heading"
    >
      <div aria-hidden className="pattern-section-fade pointer-events-none absolute inset-0 opacity-40">
        <BrandPattern variant="tiled" />
      </div>

      <div className="relative z-content mx-auto max-w-7xl px-gutter-m lg:px-gutter-d">
        {/* Header + filter trigger. The row keeps NO transform (only the title block reveals) so the
            popover's `position: fixed` resolves against the viewport, not a transformed ancestor. */}
        <div className="relative z-30 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="vg-reveal max-w-2xl">
            <h2
              id="video-gallery-heading"
              className="font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3.1rem)' }}
            >
              The work, in motion<span className="text-orange">.</span>
            </h2>
            <p className="mt-4 text-base text-white/65 md:text-lg">
              Films and reels across every brand we shoot — tap any cut to watch it full-screen.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <p className="flex items-baseline gap-1.5">
              <span className="font-sans text-[0.8rem] font-semibold tabular-nums text-white/55">
                {String(filtered.length).padStart(2, '0')}
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/30">
                {filtered.length === 1 ? 'film' : 'films'}
              </span>
            </p>

            {/* Filter popover */}
            <div ref={popoverRef} className="relative z-40">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-haspopup="dialog"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-colors',
                  isFiltered || open
                    ? 'border-orange/60 text-white'
                    : 'border-white/15 text-white/70 hover-fine:hover:border-white/35 hover-fine:hover:text-white',
                )}
              >
                <SlidersIcon />
                Filter
                {isFiltered && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[0.62rem] font-bold tabular-nums text-black">
                    {activeCount}
                  </span>
                )}
              </button>

              {open && (
                <div
                  role="dialog"
                  aria-label="Filter films"
                  className="vg-pop z-50 rounded-2xl border border-white/10 bg-[#2b2b2b] p-5 shadow-2xl shadow-black/60 fixed inset-x-4 bottom-4 max-h-[78vh] origin-bottom overflow-y-auto sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-3 sm:max-h-none sm:w-[min(90vw,380px)] sm:origin-top-right sm:overflow-visible"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold uppercase tracking-wider text-white">Filter</p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close filters"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover-fine:hover:bg-white/10 hover-fine:hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-5">
                    <FilterChips label="Craft" options={cats} active={category} onSelect={setCategory} />
                    <FilterChips label="Client" options={clis} active={client} onSelect={setClient} />
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={reset}
                      disabled={!isFiltered}
                      className={cn(
                        'text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors',
                        isFiltered
                          ? 'text-white/60 hover-fine:hover:text-orange'
                          : 'cursor-default text-white/20',
                      )}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-orange px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-transform duration-200 hover-fine:hover:-translate-y-0.5"
                    >
                      Show {filtered.length}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid — remounts on filter change to replay the CSS entrance stagger. */}
        {filtered.length > 0 ? (
          <div
            key={`${category}|${client}`}
            className="vg-grid mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 2xl:grid-cols-3"
          >
            {filtered.map((project, i) => (
              <div
                key={project.slug}
                className="vg-item"
                style={{ animationDelay: `${Math.min(i, 9) * 55}ms` }}
              >
                <VideoCard project={project} onOpen={() => onOpen(project)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-white/12 py-16 text-center">
            <p className="text-white/60">No films in this cut yet.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-sm font-semibold uppercase tracking-wider text-orange transition-hover hover-fine:hover:text-orange-hover"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* CSS-only entrances: start hidden only when motion is welcome, always end visible. */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .vg-item { opacity: 0; animation: vgIn 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
          .vg-pop { animation: vgPop 0.16s ease-out; }
        }
        @keyframes vgIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
        @keyframes vgPop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
