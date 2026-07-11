'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function usePageTransition() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (reducedMotion) return;

    let timer: number;
    const frame = requestAnimationFrame(() => {
      setActive(true);
      timer = window.setTimeout(() => setActive(false), 450);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname, reducedMotion]);

  return active;
}
