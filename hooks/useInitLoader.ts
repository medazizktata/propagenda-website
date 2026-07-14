'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

const STORAGE_KEY = 'propagenda-init-seen';

function getInitialState(): 'visible' | 'done' {
  if (typeof window === 'undefined') return 'done';
  if (sessionStorage.getItem(STORAGE_KEY)) return 'done';
  return 'visible';
}

export function useInitLoader() {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<'visible' | 'done'>(getInitialState);

  useEffect(() => {
    if (reducedMotion) {
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (state !== 'visible' || reducedMotion) return;

    const start = performance.now();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      sessionStorage.setItem(STORAGE_KEY, '1');
      setState('done');
    };
    // Dismiss once the heavy 3D asset is ready, keeping a minimum on-screen time.
    const onReady = () => {
      const wait = Math.max(0, 1100 - (performance.now() - start)) + 350;
      window.setTimeout(finish, wait);
    };

    if ((window as unknown as { __hero3dReady?: boolean }).__hero3dReady) {
      onReady();
    } else {
      window.addEventListener('hero3d:ready', onReady, { once: true });
    }
    const maxTimer = window.setTimeout(finish, 5000); // safety fallback

    return () => {
      window.removeEventListener('hero3d:ready', onReady);
      window.clearTimeout(maxTimer);
    };
  }, [state, reducedMotion]);

  return {
    visible: !reducedMotion && state === 'visible',
    ready: reducedMotion || state === 'done',
    dismiss: () => setState('done'),
  };
}
