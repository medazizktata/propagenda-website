'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

interface UseScrollPinOptions {
  containerRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLElement | null>;
  end?: string;
  scrub?: number | boolean;
  onProgress?: (progress: number) => void;
}

export function useScrollPin({
  containerRef,
  pinRef,
  end = '+=250%',
  scrub = 0.5,
  onProgress,
}: UseScrollPinOptions) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    registerGsap();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end,
        pin,
        scrub,
        anticipatePin: 1,
        onUpdate: (self) => onProgress?.(self.progress),
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, pinRef, end, scrub, reducedMotion, onProgress]);
}
