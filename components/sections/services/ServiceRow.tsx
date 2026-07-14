'use client';

import Link from 'next/link';
import { cn } from '@/components/ui/cn';
import type { ServiceHubCard } from '@/content/servicesHub';

interface ServiceRowProps {
  card: ServiceHubCard;
  index: number;
  /** This row is the hovered/focused one. */
  isActive: boolean;
  /** Another row is active, so this one recedes. */
  isDimmed: boolean;
  onActivate: (index: number) => void;
}

/**
 * One row of the services index: a full-width link, service name on the left, discipline
 * tag + arrow on the right. Hover/focus lights it (white + orange arrow); when a sibling is
 * active this row dims. The GSAP scroll-reveal targets the wrapping <li> (not this element)
 * so the two opacity systems never fight.
 */
export function ServiceRow({ card, index, isActive, isDimmed, onActivate }: ServiceRowProps) {
  return (
    <Link
      href={`/services/${card.slug}`}
      // Mouse hover + keyboard focus reveal immediately. Touch is handled in onClick so a
      // synthetic pointerenter can't pre-activate the row.
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onActivate(index);
      }}
      onFocus={() => onActivate(index)}
      onClick={(e) => {
        // Touch (no hover): first tap reveals the work, second tap on the active row navigates.
        if (
          !isActive &&
          typeof window !== 'undefined' &&
          window.matchMedia('(hover: none)').matches
        ) {
          e.preventDefault();
          onActivate(index);
        }
      }}
      className={cn(
        'group/row flex items-center justify-between gap-4 border-b border-white/12 py-1.5 outline-none md:py-2',
        'transition-[opacity,color] duration-300 ease-out',
        'focus-visible:border-orange',
        isDimmed && 'opacity-35',
      )}
    >
      <span
        className={cn(
          'min-w-0 truncate font-sans font-bold uppercase leading-[1.02] tracking-tight transition-colors duration-300',
          isActive ? 'text-white' : 'text-white/85',
        )}
        style={{ fontSize: 'clamp(1rem, 2.8vw, 2.7rem)' }}
      >
        {card.title}
        <span className="text-orange">.</span>
      </span>

      <span className="flex shrink-0 items-center gap-3 md:gap-5">
        <span className="hidden text-2xs font-semibold uppercase tracking-[0.22em] text-white/45 sm:inline md:text-xs">
          {card.tag}
        </span>
        <span
          aria-hidden
          className={cn(
            'text-base font-bold text-orange transition-all duration-300 ease-out md:text-xl',
            isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0',
          )}
        >
          &rarr;
        </span>
      </span>
    </Link>
  );
}
