'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

type LoaderPatternProps = {
  className?: string;
  /** Restart entrance when the splash remounts. */
  playKey?: string | number;
};

/**
 * Single pattern motion for orange splash screens (one GSAP timeline only).
 */
export function LoaderPattern({ className, playKey = 0 }: LoaderPatternProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const sheet = root.querySelector<HTMLElement>('.loader-pattern-sheet');
    if (!sheet) return;

    const ctx = gsap.context(() => {
      gsap.set(sheet, {
        scale: 1.28,
        xPercent: -3,
        yPercent: 2,
        rotation: -1.5,
        opacity: 0,
        transformOrigin: '50% 50%',
      });

      gsap
        .timeline({ defaults: { ease: 'sine.inOut' } })
        .to(sheet, {
          opacity: 0.22,
          scale: 1.18,
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          duration: 0.45,
          ease: 'power2.out',
        })
        .to(sheet, {
          scale: 1.28,
          xPercent: -4,
          yPercent: 3,
          rotation: 2,
          opacity: 0.26,
          duration: 6.5,
          yoyo: true,
          repeat: -1,
        });
    }, root);

    return () => ctx.revert();
  }, [playKey, reducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <BrandPattern
        variant="dense"
        className={cn(
          'loader-pattern-sheet will-change-transform [filter:brightness(0)]',
          reducedMotion && 'scale-[1.18] opacity-[0.2]',
        )}
      />
    </div>
  );
}
