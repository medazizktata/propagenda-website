'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { ffInitLoader } from '@/lib/featureFlags';

const SESSION_KEY = 'pg-init-loader-seen';

function hasSeenLoaderThisSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markLoaderSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* storage unavailable — loader simply replays next load */
  }
}

/** Opt out with NEXT_PUBLIC_FF_INIT_LOADER=false (or legacy NEXT_PUBLIC_INIT_LOADER). */
export function isInitLoaderEnabled() {
  return ffInitLoader;
}

/**
 * Orange quote splash on the first full page load of a session (MOTION_SYSTEM spec);
 * subsequent hard loads skip straight to content. Soft client navigations use
 * PageTransitionLoader instead.
 */
export function useInitLoader() {
  const reducedMotion = useReducedMotion();
  const enabled = isInitLoaderEnabled();
  const [state, setState] = useState<'visible' | 'done'>(() =>
    enabled && typeof window !== 'undefined' && !hasSeenLoaderThisSession()
      ? 'visible'
      : 'done',
  );

  useEffect(() => {
    if (!enabled || reducedMotion) {
      setState('done');
    }
  }, [enabled, reducedMotion]);

  useEffect(() => {
    if (!enabled || state !== 'visible' || reducedMotion) return;

    markLoaderSeen();

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
