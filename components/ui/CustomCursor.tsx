'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';

/**
 * Site-wide custom cursor follower (MicDrop-style): a single solid orange dot with
 * `mix-blend-mode: difference`, so it stays visible on any background (orange on
 * dark, inverts to blue on light). It trails the pointer with a slight lag and
 * grows over interactive elements.
 *
 * This only AUGMENTS the pointer — the native cursor stays visible and rides on top
 * of the dot. Fine-pointer + non-reduced-motion only (touch / reduced-motion users
 * simply don't get the follower).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    const x = gsap.quickTo(dot, 'x', { duration: 0.14, ease: 'power3' });
    const y = gsap.quickTo(dot, 'y', { duration: 0.14, ease: 'power3' });

    let shown = false;
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(dot, { autoAlpha: 1, duration: 0.25 });
      }
    };
    const hide = () => {
      shown = false;
      gsap.to(dot, { autoAlpha: 0, duration: 0.2 });
    };

    const GROW = 'a, button, [role="button"], label, summary, select, [data-cursor="grow"]';
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      dot.classList.toggle('is-active', !!el?.closest?.(GROW));
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.removeEventListener('mouseleave', hide);
    };
  }, []);

  return <div ref={dotRef} aria-hidden className="cursor-dot" />;
}
