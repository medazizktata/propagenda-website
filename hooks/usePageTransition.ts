'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { isRouteUnlocked, openComingSoonModal } from '@/lib/softLaunch';

export type TransitionPhase = 'idle' | 'cover' | 'reveal';

/** Orange wipe fills the screen, then fade-out reveals the new route. */
export const COVER_MS = 340;
export const REVEAL_MS = 280;
/** Time the stacked quote stays readable after the wipe covers the screen. */
export const QUOTE_HOLD_MS = 480;
const COVER_COMPLETE_MS = COVER_MS + 30;
/** Extra hold on home so Three can mount under the cover before fade-out. */
const HOME_3D_BEAT_MS = 160;
const HOME_3D_MAX_WAIT_MS = 4500;

function isHomePath(path: string) {
  return path === '/' || path === '';
}

function isDesktopViewport() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

/**
 * Mid-route: full-screen orange cover → navigate under it → slow opacity fade
 * so the destination reveals while the fill opts out.
 * Home routes hold the cover until the hero 3D logo is ready (desktop).
 */
export function usePageTransition(): { phase: TransitionPhase; targetPath: string | null } {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
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
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      // Soft launch: block unfinished routes — stay put and show the popup.
      if (!isRouteUnlocked(url.pathname)) {
        e.preventDefault();
        openComingSoonModal(url.pathname);
        return;
      }

      // Reduced motion: let the browser/Next handle navigation normally.
      if (reducedMotion) return;

      e.preventDefault();
      if (phase !== 'idle') return;

      pendingRef.current = url.pathname + url.search + url.hash;
      setTargetPath(url.pathname);
      // Force a fresh ready signal when landing on home with the 3D hero.
      if (isHomePath(url.pathname)) {
        (window as unknown as { __hero3dReady?: boolean }).__hero3dReady = false;
      }
      setPhase('cover');
      timers.current.push(
        window.setTimeout(() => {
          if (pendingRef.current) router.push(pendingRef.current);
        }, COVER_COMPLETE_MS),
      );
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [reducedMotion, router, phase]);

  useEffect(() => {
    if (pendingRef.current == null) return;
    pendingRef.current = null;

    const startReveal = () => {
      setPhase('reveal');
      timers.current.push(
        window.setTimeout(() => {
          setPhase('idle');
          setTargetPath(null);
        }, REVEAL_MS + 40),
      );
    };

    // Non-home: keep the quote on screen briefly, then fade out.
    if (!isHomePath(pathname) || !isDesktopViewport()) {
      timers.current.push(window.setTimeout(startReveal, QUOTE_HOLD_MS));
      return;
    }

    // Home + desktop: hold until 3D is ready (and at least the quote hold).
    const win = window as unknown as { __hero3dReady?: boolean };
    const quoteReadyAt = performance.now() + QUOTE_HOLD_MS;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('hero3d:ready', onReady);
      window.clearTimeout(maxWait);
      const wait = Math.max(0, quoteReadyAt - performance.now()) + HOME_3D_BEAT_MS;
      timers.current.push(window.setTimeout(startReveal, wait));
    };
    const onReady = () => finish();

    if (win.__hero3dReady) {
      finish();
    } else {
      window.addEventListener('hero3d:ready', onReady, { once: true });
      // Race: ready may have fired between the reset and this listener.
      if (win.__hero3dReady) finish();
    }
    const maxWait = window.setTimeout(finish, HOME_3D_MAX_WAIT_MS);

    return () => {
      done = true;
      window.removeEventListener('hero3d:ready', onReady);
      window.clearTimeout(maxWait);
    };
  }, [pathname]);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((t) => window.clearTimeout(t));
  }, []);

  return { phase, targetPath };
}
