'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';

/**
 * Site-wide custom cursor (MicDrop-style): a single solid orange dot with
 * `mix-blend-mode: difference`, so it stays visible on any background (reads
 * orange on dark, inverts to blue on light). It follows the pointer with a
 * slight lag and grows over interactive elements.
 *
 * Only active on a fine pointer (mouse) and when reduced-motion is NOT requested —
 * touch devices and reduced-motion users keep the native cursor. The native I-beam
 * is preserved over text fields so forms stay usable.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
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
    const TEXT =
      'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const isText = !!el?.closest?.(TEXT);
      dot.classList.toggle('is-active', !isText && !!el?.closest?.(GROW));
      root.classList.toggle('cursor-over-text', isText);
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.removeEventListener('mouseleave', hide);
      root.classList.remove('has-custom-cursor', 'cursor-over-text');
    };
  }, []);

  return <div ref={dotRef} aria-hidden className="cursor-dot" />;
}
