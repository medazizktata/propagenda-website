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
        // Cuberto-style: a longer travel that settles on an expo.out glide (no snap/bounce).
        y: 56,
        duration: 0.9,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, selector, reducedMotion, translateOnly]);
}
