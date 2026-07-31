'use client';

import Link from 'next/link';
import { cn } from '@/components/ui/cn';

interface WorkIndexRowProps {
  /** Global position across every group — keys the shared bloom panel + active state. */
  index: number;
  href: string;
  /** Project name at display scale, shown in its natural case (no CSS-uppercase). */
  name: string;
  /** Industry · year, revealed only while this row is active. */
  caption: string;
  isActive: boolean;
  /** Another row is active, so this one recedes. */
  isDimmed: boolean;
  onActivate: (index: number) => void;
}

/**
 * One line of the "famous work" index: a full-width link with the project name set huge
 * on the left and its industry/year caption on the right. Hover/focus lights the row and
 * blooms its real hero behind the names (handled by the parent); a sibling being active
 * dims this one. Touch (no hover) reveals on the first tap, navigates on the second.
 */
export function WorkIndexRow({
  index,
  href,
  name,
  caption,
  isActive,
  isDimmed,
  onActivate,
}: WorkIndexRowProps) {
  return (
    <Link
      href={href}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onActivate(index);
      }}
      onFocus={() => onActivate(index)}
      onClick={(e) => {
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
        'group/row flex flex-col gap-1 border-b border-white/12 py-4 outline-none',
        'transition-[opacity,color] duration-300 ease-out focus-visible:border-orange',
        'md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-5',
        isDimmed && 'opacity-40',
      )}
    >
      <span
        className={cn(
          'font-sans font-bold leading-[0.98] tracking-tight transition-colors duration-300',
          '[text-shadow:0_2px_28px_rgba(0,0,0,0.55)]',
          isActive ? 'text-white' : 'text-white/60 group-hover/row:text-white/90',
        )}
        style={{ fontSize: 'clamp(1.9rem, 5.4vw, 4.5rem)' }}
      >
        {name}
        <span
          className={cn(
            'transition-colors duration-300',
            isActive ? 'text-orange' : 'text-white/25',
          )}
        >
          .
        </span>
      </span>

      <span
        className={cn(
          'shrink-0 font-sans text-sm font-medium text-white/70 transition-opacity duration-300 md:text-base',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      >
        {caption}
      </span>
    </Link>
  );
}
