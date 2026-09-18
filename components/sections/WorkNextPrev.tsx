'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CaseStudyRecord } from '@/types/content';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

type Side = 'prev' | 'next';

const NAME_SIZE = { fontSize: 'clamp(1.75rem, 5vw, 3.75rem)' } as const;

// Two-panel prev/next — the same signature as the services pages (ServiceNextPrev): hover a
// side, its imagery blooms full-bleed and the other dims, with a centre monogram divider.
function NavPanel({
  study,
  side,
  hovered,
  onHover,
}: {
  study: CaseStudyRecord;
  side: Side;
  hovered: Side | null;
  onHover: (side: Side | null) => void;
}) {
  const isActive = hovered === side;
  const isDimmed = hovered != null && hovered !== side;
  const isNext = side === 'next';
  const name = study.client ?? study.title;
  const descriptor = [study.industry, study.year].filter(Boolean).join(' · ');

  return (
    <Link
      href={`/work/${study.slug}`}
      aria-label={`${isNext ? 'Next' : 'Previous'} project: ${name}`}
      onPointerEnter={() => onHover(side)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(side)}
      onBlur={() => onHover(null)}
      className={cn(
        'group/panel relative flex min-h-[12rem] flex-col justify-center overflow-hidden py-12 outline-none transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none lg:min-h-[16rem] lg:py-20',
        isNext ? 'items-end text-right lg:pl-8 lg:pr-2' : 'items-start text-left lg:pl-2 lg:pr-8',
        isDimmed && 'opacity-[0.32]',
      )}
    >
      {study.heroImage && (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out',
            isActive ? 'opacity-100' : 'opacity-0',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={study.heroImage}
            alt=""
            className="h-full w-full scale-105 object-cover object-top transition-transform duration-700 ease-out group-hover/panel:scale-110"
          />
          {/* Darkening was heavy enough (75% flat tint + a gradient that only cleared past its
              own midpoint) that real image content effectively disappeared well before it
              reached the centre divider — the photo needs to stay visible all the way to that
              line, not fade to black partway there (explicit user direction, 2026-09-15). Both
              layers now clear up much sooner, concentrated at the outer edge only. */}
          <div className="absolute inset-0 bg-charcoal/40" />
          <div
            className={cn(
              'absolute inset-0',
              isNext
                ? 'bg-gradient-to-l from-charcoal from-0% via-charcoal/15 via-25% to-transparent to-55%'
                : 'bg-gradient-to-r from-charcoal from-0% via-charcoal/15 via-25% to-transparent to-55%',
            )}
          />
        </div>
      )}

      <span
        className={cn(
          'relative z-10 mb-4 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300',
          isNext && 'flex-row-reverse',
          isActive ? 'text-orange' : 'text-white/55',
        )}
      >
        {isNext ? 'Next' : 'Previous'}
        <span
          aria-hidden
          className={cn('inline-block h-px w-6 bg-current transition-all duration-300', isActive && 'w-10')}
        />
      </span>

      <span
        className={cn(
          'relative z-10 block max-w-full font-sans font-extrabold uppercase leading-[0.88] tracking-tighter transition-colors duration-400 ease-out',
          isActive ? 'text-white' : 'text-white/70',
        )}
        style={NAME_SIZE}
      >
        {name}
      </span>

      {descriptor && (
        <p
          className={cn(
            'relative z-10 mt-3 max-w-[28ch] text-sm leading-snug text-white/80 transition-all duration-300 ease-out',
            isActive ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
          )}
        >
          {descriptor}
        </p>
      )}
    </Link>
  );
}

export function WorkNextPrev({
  prev,
  next,
}: {
  prev?: CaseStudyRecord;
  next?: CaseStudyRecord;
}) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<Side | null>(null);

  if (!prev && !next) return null;

  return (
    <section
      className="relative hidden overflow-hidden border-t border-white/10 bg-charcoal px-gutter-m lg:block lg:px-gutter-d"
      onPointerLeave={() => setHovered(null)}
    >
      <div
        className={cn(
          'relative mx-auto grid max-w-[1700px] grid-cols-1 lg:items-stretch',
          prev && next ? 'lg:grid-cols-2' : 'lg:grid-cols-1',
        )}
      >
        {prev && (
          <NavPanel study={prev} side="prev" hovered={hovered} onHover={setHovered} />
        )}

        {next && (
          <NavPanel study={next} side="next" hovered={hovered} onHover={setHovered} />
        )}

        {/* The divider used to be its own w-12 grid column, which clipped each panel's
            (full-bleed, inset-0) image a full 1.5rem short of this line — no overlay tuning
            could ever get the image to reach it. Panels now sit edge-to-edge with zero gap,
            so this line sits exactly on the boundary the images already touch, and it's an
            overlay rather than a layout column (explicit user direction, 2026-09-15). */}
        {prev && next && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-8 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-white/15 lg:block"
          >
            <span
              className={cn(
                'absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-charcoal transition-[transform,border-color] duration-300 ease-out',
                hovered != null && !reducedMotion && 'scale-110 border-orange/55',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brand/logo-monogram.svg"
                alt=""
                className="h-4 w-4 object-contain select-none"
                draggable={false}
              />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
