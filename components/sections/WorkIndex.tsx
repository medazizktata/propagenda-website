'use client';

import { useMemo, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useFadeUpOnEnter } from '@/hooks/useFadeUpOnEnter';
import { WorkCard } from '@/components/sections/WorkCard';
import { cn } from '@/components/ui/cn';
import type { CaseStudyRecord } from '@/types/content';

export interface WorkIndexGroup {
  id: string;
  /** Sentence/title-case category label (e.g. "Automotive", "Property & interiors") — no tracked caps. */
  label: string;
  items: CaseStudyRecord[];
}

interface WorkIndexProps {
  groups: WorkIndexGroup[];
}

/**
 * The Work hub centrepiece: a contact-sheet grid of real project covers, grouped by category.
 * Every card shows its actual heroImage (or first gallery frame) at rest, on every device —
 * hover/focus only lifts a cover that was already visible. See the direction comment below.
 */
export function WorkIndex({ groups }: WorkIndexProps) {
  const ref = useRef<HTMLElement>(null);
  useFadeUpOnEnter(ref, '.work-card-reveal', { translateOnly: true });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleGroups = useMemo(
    () => (activeCategory ? groups.filter((g) => g.id === activeCategory) : groups),
    [groups, activeCategory],
  );

  return (
    <section
      ref={ref}
      className="relative bg-charcoal px-gutter-m py-16 lg:px-gutter-d lg:py-20"
    >
      {/*
        THESIS: the work index reads like a working studio's contact sheet — every project's
        real cover visible at rest, not gated behind hover — so scale and range of real client
        work are legible before anyone clicks anything.
        OWN-WORLD: Poppins carries every label here (no mono/tracked-caps kicker voice — that
        register is retired site-wide); black+orange (#f58b27) as punctuation only — the
        terminal period stays orange, never the whole name; white-on-orange banned; one
        protagonist per screen; no kicker labels, no section numbers.
        STORY: land on real, generously-sized covers grouped by category, scan the breadth of
        the portfolio in a few unhurried screens, hover only lifts and brightens a cover
        already legible. An optional filter (closed by default) narrows to one category
        without cluttering the default view with controls nobody asked for.
        FIRST VIEWPORT: a spacious multi-column grid inside the site's own editorial gutter
        (matching every other section), cards large enough to read as real work, not thumbnails
        — a lonely single-study category is folded into one shared "More work" group upstream
        in WorkPageContent.tsx rather than getting its own orphan section.
        FORM: WorkIndex.tsx + WorkCard.tsx, kept inside the same category-grouping contract
        WorkPageContent.tsx provides.
        unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
      */}
      <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-9 md:gap-11">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-pressed={filtersOpen}
            className={cn(
              'flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-sans text-sm font-medium text-white/70 transition-colors duration-300',
              'hover-fine:hover:border-white/30 hover-fine:hover:text-white',
              filtersOpen && 'border-white/30 text-white',
            )}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filter
          </button>
        </div>

        {filtersOpen ? (
          <div className="-mt-4 flex flex-wrap gap-2 md:-mt-6">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                'rounded-full border px-4 py-1.5 font-sans text-sm font-medium transition-colors duration-300',
                activeCategory === null
                  ? 'border-orange bg-orange text-ink'
                  : 'border-white/15 text-white/70 hover-fine:hover:border-white/30 hover-fine:hover:text-white',
              )}
            >
              All
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveCategory(group.id)}
                className={cn(
                  'rounded-full border px-4 py-1.5 font-sans text-sm font-medium transition-colors duration-300',
                  activeCategory === group.id
                    ? 'border-orange bg-orange text-ink'
                    : 'border-white/15 text-white/70 hover-fine:hover:border-white/30 hover-fine:hover:text-white',
                )}
              >
                {group.label}
              </button>
            ))}
          </div>
        ) : null}

        {visibleGroups.map((group) => (
          <div key={group.id} id={group.id}>
            <div className="work-card-reveal mb-5 md:mb-6">
              <h2 className="font-sans text-base font-semibold text-white/70 md:text-lg">
                {group.label}
              </h2>
            </div>
            {/*
              auto-fit + a fixed max (not 1fr) + justify-center: column count adapts to the
              viewport on its own and a short category centers its row instead of stranding a
              slab of empty track to the right, which a fixed grid-cols-N would do.
            */}
            <ul className="grid justify-center gap-x-6 gap-y-12 [grid-template-columns:repeat(auto-fit,minmax(15rem,18rem))] sm:gap-x-8 sm:[grid-template-columns:repeat(auto-fit,minmax(17rem,21rem))] xl:[grid-template-columns:repeat(auto-fit,minmax(19rem,24rem))]">
              {group.items.map((item) => (
                <WorkCard key={item.slug} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
