'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { cn } from '@/components/ui/cn';

type LoaderSplashLogoProps = {
  /** Replay hit when this changes (page transitions). */
  playKey?: string | number;
  className?: string;
};

/** White monogram — always on the orange splash, no wordmark. */
export function LoaderSplashLogo({ playKey = 0, className }: LoaderSplashLogoProps) {
  const markRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;

    const ctx = gsap.context(() => {
      gsap.set(mark, { scale: 0.35, rotation: -18, opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(mark, {
        scale: 1.12,
        rotation: 4,
        opacity: 1,
        duration: 0.24,
        ease: 'back.out(2.4)',
      })
        .to(mark, { scale: 1, rotation: 0, duration: 0.12, ease: 'power2.out' }, '-=0.04')
        .to(mark, { x: 3, duration: 0.03, ease: 'none' })
        .to(mark, { x: -2, duration: 0.03, ease: 'none' })
        .to(mark, { x: 0, duration: 0.04, ease: 'none' });
    }, mark);

    return () => ctx.revert();
  }, [playKey]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={markRef}
      src="/images/brand/logo-monogram.svg"
      alt="Propagenda"
      className={cn(
        'h-11 w-11 shrink-0 select-none will-change-transform brightness-0 invert md:h-14 md:w-14',
        className,
      )}
      draggable={false}
    />
  );
}
