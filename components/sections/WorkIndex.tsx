'use client';

import { useMemo, useRef, useState } from 'react';
import { useFadeUpOnEnter } from '@/hooks/useFadeUpOnEnter';
import { usePagination } from '@/hooks/usePagination';
import { WorkCard } from '@/components/sections/WorkCard';
import { WorkFilter, filterKey, matchesFilters, type FilterValues } from '@/components/molecules/WorkFilter';
import { Pagination } from '@/components/molecules/Pagination';
import type { CaseStudyRecord } from '@/types/content';

export interface WorkIndexGroup {
  id: string;
  /** Sentence/title-case category label (e.g. "Automotive", "Property & interiors") — no tracked caps. */
  label: string;
  items: CaseStudyRecord[];
}

interface WorkIndexProps {
  groups: WorkIndexGroup[];
  /** Every real category (sector) in display order — the filter's options. */
  sectors: readonly string[];
}

const PAGE_SIZE = 12;

/**
 * The Work hub centrepiece: a contact-sheet grid of real project covers, grouped by category.
 * Every card shows its actual heroImage (or first gallery frame) at rest, on every device —
 * hover/focus only lifts a cover that was already visible. See the direction comment below.
 * Filtering and paging are the shared WorkFilter + Pagination used by the film archive too: the
 * groups are flattened into one ordered list, filtered, paged, then regrouped per page.
 */
export function WorkIndex({ groups, sectors }: WorkIndexProps) {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  useFadeUpOnEnter(ref, '.work-card-reveal', { translateOnly: true });

  const [filters, setFilters] = useState<FilterValues>({ sector: null });
  const axes = useMemo(() => [{ id: 'sector', label: 'Sector', options: sectors }], [sectors]);

  const flat = useMemo(
    () => groups.flatMap((group) => group.items.map((item) => ({ item, group }))),
    [groups],
  );
  const filtered = useMemo(
    () => flat.filter(({ item }) => matchesFilters(item, filters, (study) => study.category)),
    [flat, filters],
  );
  const fKey = filterKey(filters);
  const pager = usePagination(filtered, PAGE_SIZE, fKey);

  // Regroup the current page, keeping list order. Unfiltered, the page keeps the upstream groups
  // (so singletons stay folded into "More work"); filtered to one sector, its heading is the sector.
  const pageGroups = useMemo(() => {
    const out: WorkIndexGroup[] = [];
    for (const { item, group } of pager.pageItems) {
      const label = filters.sector ? item.category : group.label;
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(item);
      else out.push({ id: filters.sector ? `sector-${group.id}` : group.id, label, items: [item] });
    }
    return out;
  }, [pager.pageItems, filters.sector]);

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
        <div ref={headRef} className="relative z-30 flex flex-wrap items-center justify-end gap-3">
          <WorkFilter
            axes={axes}
            values={filters}
            onChange={(axis, value) => setFilters((f) => ({ ...f, [axis]: value }))}
            onReset={() => setFilters({ sector: null })}
            resultCount={filtered.length}
            noun={['project', 'projects']}
            dialogLabel="Filter projects"
          />
        </div>

        {pageGroups.map((group) => (
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

        <Pagination
          {...pager}
          onPageChange={pager.setPage}
          noun="projects"
          scrollTargetRef={headRef}
          className="mt-4"
        />
      </div>
    </section>
  );
}
