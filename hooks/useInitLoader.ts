'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/** Opt out with NEXT_PUBLIC_INIT_LOADER=false in .env.local */
export function isInitLoaderEnabled() {
  return process.env.NEXT_PUBLIC_INIT_LOADER !== 'false';
}

/**
 * Orange quote splash on every full page load (hard reload included).
 * Soft client navigations use PageTransitionLoader instead.
 */
export function useInitLoader() {
  const reducedMotion = useReducedMotion();
  const enabled = isInitLoaderEnabled();
  const [state, setState] = useState<'visible' | 'done'>(() =>
    enabled && typeof window !== 'undefined' ? 'visible' : 'done',
  );

  useEffect(() => {
    if (!enabled || reducedMotion) {
      setState('done');
    }
  }, [enabled, reducedMotion]);

  useEffect(() => {
    if (!enabled || state !== 'visible' || reducedMotion) return;

    const start = performance.now();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setState('done');
    };
    const onReady = () => {
      const wait = Math.max(0, 700 - (performance.now() - start)) + 180;
      window.setTimeout(finish, wait);
    };

    if ((window as unknown as { __hero3dReady?: boolean }).__hero3dReady) {
      onReady();
    } else {
      window.addEventListener('hero3d:ready', onReady, { once: true });
    }
    const maxTimer = window.setTimeout(finish, 3200);

    return () => {
      window.removeEventListener('hero3d:ready', onReady);
      window.clearTimeout(maxTimer);
    };
  }, [enabled, state, reducedMotion]);

  return {
    enabled,
    visible: enabled && !reducedMotion && state === 'visible',
    ready: !enabled || reducedMotion || state === 'done',
    dismiss: () => setState('done'),
  };
}
