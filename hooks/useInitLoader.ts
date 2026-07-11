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

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setState('done');
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [state, reducedMotion]);

  return {
    visible: !reducedMotion && state === 'visible',
    ready: reducedMotion || state === 'done',
    dismiss: () => setState('done'),
  };
}
