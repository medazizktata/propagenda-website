'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * Barely-visible hollow brand pattern that drifts with the cursor.
 * Single sheet — no stacked duplicates. Reduced-motion sits still.
 */
export function CursorHollowPattern({ className }: { className?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const layer = layerRef.current;
    if (!layer) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.055;
      cur.y += (target.y - cur.y) * 0.055;
      layer.style.transform = `translate3d(${cur.x * 28}px, ${cur.y * 20}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div
        ref={layerRef}
        className="absolute -inset-[14%] opacity-[0.045] will-change-transform"
        style={{
          backgroundImage: "url('/images/brand/pattern-sheet.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0) invert(1)',
        }}
      />
    </div>
  );
}
