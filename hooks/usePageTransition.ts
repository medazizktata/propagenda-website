'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export type TransitionPhase = 'idle' | 'cover' | 'reveal';

export const TRANSITION_COLUMNS = 12;
export const TRANSITION_STAGGER_MS = 20;
const COVER_MS = 340;
const REVEAL_MS = 460;
// Wait for EVERY column to finish rising before we navigate, so the screen is fully
// covered (never see-through) at the moment the route swaps underneath.
const COVER_COMPLETE_MS = COVER_MS + (TRANSITION_COLUMNS - 1) * TRANSITION_STAGGER_MS;
const REVEAL_COMPLETE_MS = REVEAL_MS + (TRANSITION_COLUMNS - 1) * TRANSITION_STAGGER_MS;

/**
 * Drives the SMV-style route wipe as a proper two-phase transition:
 *   click → COVER (orange columns sweep up to fully hide the page) → navigate under the
 *   cover → REVEAL (columns sweep away to expose the new page).
 *
 * The old version keyed only off `pathname`, so the wipe ran *after* the new page had
 * already painted and — because it started see-through — you saw the destination flash
 * before the columns arrived. Intercepting the click and covering first fixes both.
 */
export function usePageTransition(): TransitionPhase {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const pendingRef = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  // Intercept internal link clicks: cover first, then navigate.
  useEffect(() => {
    if (reducedMotion) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || anchor.hasAttribute('download')) return;
      const targetAttr = anchor.getAttribute('target');
      if (targetAttr && targetAttr !== '_self') return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      // Only same-origin navigations to a different path get the wipe; hash/same-page and
      // external links fall through to the browser untouched.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      pendingRef.current = url.pathname + url.search + url.hash;
      setPhase('cover');
      timers.current.push(
        window.setTimeout(() => {
          if (pendingRef.current) router.push(pendingRef.current);
        }, COVER_COMPLETE_MS),
      );
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [reducedMotion, router]);

  // Once the route we covered actually commits, reveal the new page.
  useEffect(() => {
    if (pendingRef.current == null) return; // first load, or a nav we didn't initiate
    pendingRef.current = null;
    setPhase('reveal');
    timers.current.push(window.setTimeout(() => setPhase('idle'), REVEAL_COMPLETE_MS + 60));
  }, [pathname]);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((t) => window.clearTimeout(t));
  }, []);

  return phase;
}
