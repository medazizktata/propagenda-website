'use client';

import { useEffect, useRef, useState } from 'react';
import { useInitLoader } from '@/hooks/useInitLoader';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { cn } from '@/components/ui/cn';

/**
 * Home-load screen, rebuilt in SMV's first-frame style (their orange quote splash): a
 * full-bleed ORANGE field with the monogram up top, a big stacked brand line in dark ink
 * centred, and the wordmark signed at the bottom — with a thin progress rule tracking the
 * WebGL/3D payload underneath. Shown once per session (see useInitLoader).
 */

// The brand line, stacked word-group per line like SMV's "IT / BEGAN / AS / A / MISTAKE."
const QUOTE_LINES = ['LOOKING', 'FOR THE', 'BETTER', 'FUTURE.'];

export function InitLoader() {
  const { visible } = useInitLoader();
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [removed, setRemoved] = useState(false);
  const rafRef = useRef(0);

  // Count 0 → 100 over the loader window (drives the progress rule).
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const duration = 1500;
    const tick = () => {
      const p = Math.min((performance.now() - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  // Unmount after the fade-out completes.
  useEffect(() => {
    if (visible) return;
    // The page is now revealed and fully settled (fonts, hero pin-spacing, media). Recompute
    // every ScrollTrigger so pinned/scrubbed sections (esp. the 3rd) aren't stranded at stale
    // start/end positions on this first view. Double-tap after the fade to be safe.
    ScrollTrigger.refresh();
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t = window.setTimeout(() => setRemoved(true), 700);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 750);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  if (reducedMotion || removed) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-loader flex flex-col items-center justify-between overflow-hidden bg-orange px-6 py-10 transition-opacity duration-700 ease-out md:py-14',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Monogram, signed dark on the orange field. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/logo-mark.svg"
        alt="Propagenda"
        className="h-12 w-12 shrink-0 [filter:brightness(0)] md:h-14 md:w-14"
        draggable={false}
      />

      {/* Big stacked brand line, dark ink — the SMV quote-splash centrepiece. */}
      <p className="flex flex-col items-center text-center font-sans font-bold uppercase leading-[0.88] tracking-tight text-navy">
        {QUOTE_LINES.map((line) => (
          <span key={line} className="block" style={{ fontSize: 'clamp(2.75rem, 11vw, 8rem)' }}>
            {line}
          </span>
        ))}
      </p>

      {/* Signed wordmark at the foot. */}
      <span className="shrink-0 font-sans text-xs font-bold uppercase tracking-[0.4em] text-navy/80 md:text-sm">
        Propagenda
      </span>

      {/* Progress rule tracking the real load. */}
      <div className="absolute inset-x-0 bottom-0 h-1 w-full bg-navy/15">
        <div
          className="h-full bg-navy transition-[width] duration-150 ease-out"
          style={{ width: `${count}%` }}
        />
      </div>
    </div>
  );
}
