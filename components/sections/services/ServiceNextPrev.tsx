'use client';

import { useState } from 'react';
import Link from 'next/link';
import { serviceHubCards, type ServiceHubCard } from '@/content/servicesHub';
import type { ServiceSlug } from '@/types/content';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

type Side = 'prev' | 'next';

const NAME_SIZE = { fontSize: 'clamp(1.6rem, 5.5vw, 4.25rem)' } as const;

function NavPanel({
  card,
  side,
  hovered,
  onHover,
  reducedMotion,
}: {
  card: ServiceHubCard;
  side: Side;
  hovered: Side | null;
  onHover: (side: Side | null) => void;
  reducedMotion: boolean;
}) {
  const isActive = hovered === side;
  const isDimmed = hovered != null && hovered !== side;
  const preview = card.preview ?? card.image;
  const isNext = side === 'next';

  return (
    <Link
      href={`/services/${card.slug}`}
      aria-label={`${isNext ? 'Next' : 'Previous'} service: ${card.title}`}
      onPointerEnter={() => onHover(side)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(side)}
      onBlur={() => onHover(null)}
      className={cn(
        'group/panel relative flex min-h-[11rem] flex-col justify-center overflow-hidden py-10 outline-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange lg:min-h-[15rem] lg:py-16',
        isNext ? 'items-end text-right lg:pl-10 lg:pr-2' : 'items-start text-left lg:pl-2 lg:pr-10',
        isDimmed && 'opacity-[0.38]',
        isActive && !reducedMotion && 'lg:scale-[1.015]',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="" className="h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover/panel:scale-110" />
        <div className="absolute inset-0 bg-charcoal/80" />
        <div
          className={cn(
            'absolute inset-0',
            isNext
              ? 'bg-gradient-to-l from-charcoal via-charcoal/55 to-transparent'
              : 'bg-gradient-to-r from-charcoal via-charcoal/55 to-transparent',
          )}
        />
      </div>

      <span
        className={cn(
          'relative z-10 mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300',
          isNext && 'flex-row-reverse',
          isActive ? 'text-orange' : 'text-white/45',
        )}
      >
        {isNext ? 'Next service' : 'Previous service'}
        <span
          aria-hidden
          className={cn(
            'text-sm transition-transform duration-300 ease-out',
            isActive && (isNext ? 'translate-x-1.5' : '-translate-x-1.5'),
          )}
        >
          {isNext ? '→' : '←'}
        </span>
      </span>

      <span
        className={cn(
          'relative z-10 block max-w-full font-sans font-black uppercase leading-[0.9] tracking-tighter transition-[color,-webkit-text-stroke,transform] duration-400 ease-out',
          isActive
            ? 'text-white [-webkit-text-stroke:0px]'
            : 'text-transparent [-webkit-text-stroke:1.5px_#f58b27]',
          !reducedMotion && isActive && 'scale-[1.02]',
        )}
        style={NAME_SIZE}
      >
        {card.title}
      </span>

      <p
        className={cn(
          'relative z-10 mt-3 max-w-[30ch] text-sm leading-snug text-white/75 transition-all duration-300 ease-out',
          isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        )}
      >
        {card.descriptor}
      </p>
    </Link>
  );
}

export function ServiceNextPrev({ slug }: { slug: ServiceSlug }) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<Side | null>(null);

  const idx = serviceHubCards.findIndex((c) => c.slug === slug);
  if (idx === -1) return null;
  const count = serviceHubCards.length;
  const prev = serviceHubCards[(idx - 1 + count) % count];
  const next = serviceHubCards[(idx + 1) % count];

  return (
    <section
      className="relative overflow-hidden border-t border-white/10 bg-charcoal px-gutter-m lg:px-gutter-d"
      onPointerLeave={() => setHovered(null)}
    >
      <div className="relative mx-auto flex max-w-[1700px] flex-col lg:grid lg:grid-cols-2 lg:items-stretch">
        <NavPanel
          card={prev}
          side="prev"
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
        />

        <NavPanel
          card={next}
          side="next"
          hovered={hovered}
          onHover={setHovered}
          reducedMotion={reducedMotion}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-20 grid -translate-y-1/2 grid-cols-2 items-center"
        >
          <div className="flex items-center justify-end pl-6 pr-1 sm:pl-10 lg:pl-14 lg:pr-1.5">
            <span className="h-px w-full bg-white/12" />
          </div>
          <div className="flex items-center justify-start pl-1 pr-6 sm:pr-10 lg:pl-1.5 lg:pr-14">
            <span className="h-px w-full bg-white/12" />
          </div>
          <span
            className={cn(
              'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center px-1 transition-transform duration-300 ease-out',
              hovered != null && !reducedMotion && 'scale-110',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo-monogram.svg"
              alt=""
              className="h-4 w-4 shrink-0 select-none sm:h-5 sm:w-5"
              draggable={false}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
