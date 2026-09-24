'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { VideoCard } from '@/components/molecules/VideoCard';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { WorkFilter, filterKey, matchesFilters, type FilterValues } from '@/components/molecules/WorkFilter';
import { Pagination } from '@/components/molecules/Pagination';
import { usePagination } from '@/hooks/usePagination';
import type { VideoProject } from '@/types/content';

const PAGE_SIZE = 12;

// The filterable archive: all cuts show by default; filtering is the shared WorkFilter popover
// (same control as the design work index), paged by the shared Pagination. The grid remounts on
// filter or page change so the entrance replays for the new set.
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
  const headRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [filters, setFilters] = useState<FilterValues>({ craft: null, client: null });

  // Only surface filter values that actually exist in the data.
  const axes = useMemo(
    () => [
      { id: 'craft', label: 'Craft', options: categories.filter((c) => projects.some((p) => p.category === c)) },
      { id: 'client', label: 'Client', options: clients.filter((c) => projects.some((p) => p.client === c)) },
    ],
    [categories, clients, projects],
  );

  const filtered = useMemo(
    () =>
      projects.filter((p) =>
        matchesFilters(p, filters, (item, axis) => (axis === 'craft' ? item.category : item.client)),
      ),
    [projects, filters],
  );

  const fKey = filterKey(filters);
  const pager = usePagination(filtered, PAGE_SIZE, fKey);
  const reset = () => setFilters({ craft: null, client: null });

  // Header + cards reveal on scroll (cards re-bind when the filter set changes).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    registerGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.vg-reveal, .vg-item', { autoAlpha: 1, y: 0, clearProps: 'transform' });
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
      gsap.utils.toArray<HTMLElement>('.vg-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay: (i % 2) * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        );
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion, fKey, pager.page]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 lg:py-28"
      aria-labelledby="video-gallery-heading"
    >
      <div className="relative z-content mx-auto max-w-[1180px] px-gutter-m lg:px-gutter-d">
        {/* Header + filter — no transform on this row so the popover's fixed/absolute positioning stays clean. */}
        <div ref={headRef} className="relative z-30 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="vg-reveal max-w-2xl">
            <h2
              id="video-gallery-heading"
              className="font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3.1rem)' }}
            >
              The work, in motion<span className="text-orange">.</span>
            </h2>
            <p className="mt-4 text-base text-white/65 md:text-lg">
              Films and reels across every brand we shoot. Tap any cut to watch it full-screen.
            </p>
          </div>

          <WorkFilter
            axes={axes}
            values={filters}
            onChange={(axis, value) => setFilters((f) => ({ ...f, [axis]: value }))}
            onReset={reset}
            resultCount={filtered.length}
            noun={['film', 'films']}
            dialogLabel="Filter films"
          />
        </div>

        {/* 2-col staggered grid — Cuberto rhythm: big gap, right column drops. */}
        {filtered.length > 0 ? (
          <div
            key={`${fKey}#${pager.page}`}
            className="vg-grid mt-14 grid grid-cols-1 gap-x-8 gap-y-8 sm:mt-20 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10 lg:gap-x-[5.5rem] lg:gap-y-12"
          >
            {pager.pageItems.map((project, i) => (
              <div
                key={project.slug}
                className={cn('vg-item', i % 2 === 1 && 'sm:mt-16 lg:mt-20')}
              >
                <VideoCard project={project} onOpen={() => onOpen(project)} />
              </div>
            ))}
          </div>
        ) : null}
        {filtered.length > 0 ? (
          <Pagination
            {...pager}
            onPageChange={pager.setPage}
            noun="films"
            scrollTargetRef={headRef}
            className="mt-16 sm:mt-20"
          />
        ) : (
          <div className="mt-14 py-16 text-center sm:mt-20">
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

    </section>
  );
}
