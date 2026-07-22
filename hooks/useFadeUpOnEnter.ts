'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function useFadeUpOnEnter(
  ref: RefObject<HTMLElement | null>,
  selector = '[data-animate]',
  opts: { translateOnly?: boolean } = {},
) {
  const reducedMotion = useReducedMotion();
  const { translateOnly = false } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    registerGsap();

    const ctx = gsap.context(() => {
      // `translateOnly` keeps content visible by default (no opacity gate), so a
      // ScrollTrigger that never fires — a headless render, or one desynced by a pinned
      // hero above — can never leave the section blank. Motion only nudges position.
      gsap.from(el.querySelectorAll(selector), {
        ...(translateOnly ? {} : { opacity: 0 }),
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, selector, reducedMotion, translateOnly]);
}
