import Link from 'next/link';
import { serviceHubCards } from '@/content/servicesHub';
import type { ServiceSlug } from '@/types/content';

// SMV project-detail signature: giant PREV / NEXT names in outline text that fill solid on
// hover, split by a diamond. Adapted to browse between the 8 services (wraps around). Names
// are stacked (not side-by-side) so long service names get the full width at giant scale.
const OUTLINE =
  'block font-sans font-black uppercase leading-[0.9] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_#f58b27] transition-colors duration-300 group-hover/np:text-white group-hover/np:[-webkit-text-stroke:0px]';
const NAME_SIZE = { fontSize: 'clamp(1.6rem, 5.5vw, 5rem)' } as const;

export function ServiceNextPrev({ slug }: { slug: ServiceSlug }) {
  const idx = serviceHubCards.findIndex((c) => c.slug === slug);
  if (idx === -1) return null;
  const count = serviceHubCards.length;
  const prev = serviceHubCards[(idx - 1 + count) % count];
  const next = serviceHubCards[(idx + 1) % count];

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-charcoal py-16 lg:py-20">
      <div className="mx-auto max-w-[1700px] px-gutter-m lg:px-gutter-d">
        <Link href={`/services/${prev.slug}`} className="group/np block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
            Previous service
          </span>
          <span className={OUTLINE} style={NAME_SIZE}>
            {prev.title}
          </span>
        </Link>

        <div className="my-6 flex items-center gap-5 md:my-8">
          <span aria-hidden className="h-px flex-1 bg-white/12" />
          <span aria-hidden className="text-lg text-orange">
            &#9670;
          </span>
          <span aria-hidden className="h-px flex-1 bg-white/12" />
        </div>

        <Link href={`/services/${next.slug}`} className="group/np block text-right">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
            Next service
          </span>
          <span className={OUTLINE} style={NAME_SIZE}>
            {next.title}
          </span>
        </Link>
      </div>
    </section>
  );
}
