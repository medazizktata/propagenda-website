import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';

// SMV project pages are carried by a dense image grid. Until real per-service galleries
// exist, show a "selected work" grid from the real portfolio renders (studio work) — hover
// Ken-Burns zoom + caption reveal, SMV-style. Links to the work hub.
const WORK = [
  { img: '/images/portfolio/work-sanapex.png', title: 'Sanapex Interiors' },
  { img: '/images/portfolio/work-restaurant.png', title: 'Darabzeen Al Ward' },
  { img: '/images/portfolio/work-quickcars.png', title: 'Quick Cars' },
  { img: '/images/portfolio/work-ghaftree.png', title: 'Ghaf Tree' },
  { img: '/images/portfolio/work-events.png', title: 'BIL Events' },
  { img: '/images/portfolio/work-food.png', title: 'Food & Lifestyle' },
];

export function ServiceWorkGrid() {
  return (
    <section className="relative border-t border-white/10 px-gutter-m py-20 lg:px-gutter-d lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="sd-reveal mb-8 flex items-end justify-between gap-4">
          <SectionLabel>Selected work</SectionLabel>
          <Link
            href="/work"
            className="text-xs font-semibold uppercase tracking-wider text-white/60 transition-hover hover-fine:hover:text-orange"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {WORK.map((w) => (
            <Link
              key={w.img}
              href="/work"
              className="group/tile sd-reveal relative aspect-[4/3] overflow-hidden rounded-xl bg-white/[0.03]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.img}
                alt={w.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/tile:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100" />
              <div className="absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-between opacity-0 transition-all duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
                <span className="font-sans text-sm font-bold uppercase tracking-tight text-white">
                  {w.title}
                </span>
                <span aria-hidden className="text-orange">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
