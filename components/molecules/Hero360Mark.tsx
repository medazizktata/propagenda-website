'use client';

import { useEffect, useRef } from 'react';
import { hero360Degrees } from '@/lib/motion/hero360Sync';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

export function Hero360Mark({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    let raf = 0;
    const tick = (now: number) => {
      if (ref.current) {
        ref.current.style.transform = `rotate(${hero360Degrees(now)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <span
      ref={ref}
      className={cn(
        'inline-block origin-center align-middle text-base font-extrabold text-orange sm:text-lg',
        className,
      )}
    >
      360&deg;
    </span>
  );
}
