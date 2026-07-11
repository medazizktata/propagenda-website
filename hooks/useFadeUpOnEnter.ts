'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function useFadeUpOnEnter(ref: RefObject<HTMLElement | null>, selector = '[data-animate]') {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(selector), {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, selector, reducedMotion]);
}
