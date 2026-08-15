'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';

declare global {
  // Exposed so programmatic scrolls (anchor jumps, the manifesto glide, the legal rail)
  // can drive / pause the same instance instead of fighting it.
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Site-wide smooth scrolling (Lenis) synced to GSAP's ticker, so every ScrollTrigger
 * (pins, scrubs, reveals) reads the smoothed position and stays in step. Disabled under
 * reduced-motion; native touch scrolling is preserved (only the wheel is smoothed).
 * Nested scroll containers (e.g. the contact snap grid) are untouched — Lenis only
 * smooths the page scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // keep native touch scrolling
    });
    window.__lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Smooth in-page anchor navigation through Lenis (native jumps would fight it).
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
