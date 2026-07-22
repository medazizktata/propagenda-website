'use client';

import { useState } from 'react';
import Link from 'next/link';
import { serviceHubCards, type ServiceHubCard } from '@/content/servicesHub';
import type { ServiceSlug } from '@/types/content';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

type Side = 'prev' | 'next';

const NAME_SIZE = { fontSize: 'clamp(1.75rem, 5vw, 3.75rem)' } as const;

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
        'group/panel relative flex min-h-[12rem] flex-col justify-center overflow-hidden py-12 outline-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange lg:min-h-[16rem] lg:py-20',
        isNext ? 'items-end text-right lg:pl-14 lg:pr-4' : 'items-start text-left lg:pl-4 lg:pr-14',
        isDimmed && 'opacity-[0.32]',
        isActive && !reducedMotion && 'lg:scale-[1.01]',
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
        <img
          src={preview}
          alt=""
          className="h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover/panel:scale-110"
        />
        <div className="absolute inset-0 bg-charcoal/75" />
        <div
          className={cn(
            'absolute inset-0',
            isNext
              ? 'bg-gradient-to-l from-charcoal via-charcoal/50 to-transparent'
              : 'bg-gradient-to-r from-charcoal via-charcoal/50 to-transparent',
          )}
        />
      </div>

      <span
        className={cn(
          'relative z-10 mb-4 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300',
          isNext && 'flex-row-reverse',
          isActive ? 'text-orange' : 'text-white/40',
        )}
      >
        {isNext ? 'Next' : 'Previous'}
        <span
          aria-hidden
          className={cn(
            'inline-block h-px w-6 bg-current transition-all duration-300',
            isActive && 'w-10',
          )}
        />
      </span>

      <span
        className={cn(
          'relative z-10 block max-w-full font-sans font-black uppercase leading-[0.88] tracking-tighter transition-colors duration-400 ease-out',
          isActive ? 'text-white' : 'text-white/55',
        )}
        style={NAME_SIZE}
      >
        {card.title}
      </span>

      <p
        className={cn(
          'relative z-10 mt-3 max-w-[28ch] text-sm leading-snug text-white/70 transition-all duration-300 ease-out',
          isActive ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
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
          className="pointer-events-none absolute inset-y-8 left-1/2 z-20 hidden -translate-x-1/2 lg:flex lg:flex-col lg:items-center"
        >
          <span className="w-px flex-1 bg-white/15" />
          <span
            className={cn(
              'my-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-charcoal transition-transform duration-300 ease-out',
              hovered != null && !reducedMotion && 'scale-110 border-orange/50',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo-monogram.svg"
              alt=""
              className="h-3.5 w-3.5 shrink-0 select-none"
              draggable={false}
            />
          </span>
          <span className="w-px flex-1 bg-white/15" />
        </div>
      </div>
    </section>
  );
}
