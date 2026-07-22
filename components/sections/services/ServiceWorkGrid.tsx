import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { cn } from '@/components/ui/cn';

// SMV project pages are carried by a dense image grid. Until real per-service galleries exist,
// show a "selected work" mosaic from the real portfolio renders — an asymmetric editorial
// layout (feature tile + varied sizes), hover Ken-Burns zoom + caption reveal. Links to /work.
const WORK = [
  { img: '/images/portfolio/work-sanapex.png', title: 'Sanapex Interiors' },
  { img: '/images/portfolio/work-restaurant.png', title: 'Darabzeen Al Ward' },
  { img: '/images/portfolio/work-quickcars.png', title: 'Quick Cars' },
  { img: '/images/portfolio/work-ghaftree.png', title: 'Ghaf Tree' },
  { img: '/images/portfolio/work-events.png', title: 'BIL Events' },
  { img: '/images/portfolio/work-food.png', title: 'Food & Lifestyle' },
];

// Asymmetric spans — one big feature, one wide, two small, two wide.
const SPANS = [
  'col-span-2 row-span-2',
  'col-span-2',
  'col-span-1',
  'col-span-1',
  'col-span-2',
  'col-span-2',
];

export function ServiceWorkGrid() {
  return (
    <section className="relative px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="sd-reveal mb-8 flex items-end justify-between gap-4">
          <SectionLabel>Selected work</SectionLabel>
          <Link
            href="/work"
            className="text-xs font-semibold uppercase tracking-wider text-white/60 transition-hover hover-fine:hover:text-orange"
          >
            View all
          </Link>
        </div>
        <div className="grid auto-rows-[9.5rem] grid-cols-2 gap-3 md:auto-rows-[11.5rem] md:grid-cols-4 md:gap-4">
          {WORK.map((w, i) => (
            <Link
              key={w.img}
              href="/work"
              className={cn(
                'group/tile sd-reveal relative overflow-hidden rounded-xl bg-white/[0.03]',
                SPANS[i % SPANS.length],
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.img}
                alt={w.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/tile:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100" />
              <span className="absolute inset-x-4 bottom-4 translate-y-2 font-sans text-sm font-bold uppercase tracking-tight text-white opacity-0 transition-all duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
                {w.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
