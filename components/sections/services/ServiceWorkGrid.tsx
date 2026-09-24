import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { cn } from '@/components/ui/cn';
import { isPageUnlocked } from '@/lib/featureFlags';
import type { GalleryImage } from '@/types/content';

// SMV project pages are carried by a dense image grid. Each service shows its own "selected work"
// mosaic, driven by the service's CMS gallery (services.gallery in D1, seed in content/services):
// real, watermarked client work chosen for that service. Asymmetric editorial layout (feature tile
// + varied sizes), hover Ken-Burns zoom + caption reveal. Tiles link to the case study (or the film
// library) named in the item's `href`.

// Asymmetric spans — one big feature, one wide, two small, two wide.
const SPANS = [
  'col-span-2 row-span-2',
  'col-span-2',
  'col-span-1',
  'col-span-1',
  'col-span-2',
  'col-span-2',
];

/** Units each span fills on the 4-column desktop grid. */
const UNITS = [4, 2, 1, 1, 2, 2];

export function ServiceWorkGrid({ items }: { items: GalleryImage[] }) {
  if (!isPageUnlocked('work') || items.length === 0) return null;

  // If the item count leaves a hole in the last row, stretch the last tile to close it.
  const used = items.reduce((sum, _, i) => sum + UNITS[i % UNITS.length], 0);
  const stretchLast = used % 4 !== 0;

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
          {items.map((w, i) => (
            <Link
              key={w.src}
              href={w.href ?? '/work'}
              className={cn(
                'group/tile sd-reveal relative overflow-hidden rounded-xl bg-white/[0.03]',
                SPANS[i % SPANS.length],
                stretchLast && i === items.length - 1 && 'col-span-2 md:col-span-4',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.src}
                alt={w.alt}
                width={w.width}
                height={w.height}
                loading="lazy"
                decoding="async"
                style={w.position ? { objectPosition: w.position } : undefined}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/tile:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100" />
              {w.caption && (
                <span className="absolute inset-x-4 bottom-4 translate-y-2 font-sans text-sm font-bold uppercase tracking-tight text-white opacity-0 transition-all duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
                  {w.caption}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
