'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import type { HeroSceneFactory } from './types';

/** Longest frame the scene is asked to integrate. Guards against a huge dt after a tab-away. */
const MAX_DELTA = 1 / 20;
/** Fallback if requestIdleCallback never fires (Safari before 16.4, or a permanently busy main thread). */
const IDLE_TIMEOUT_MS = 300;

type Props = {
  /**
   * Must be stable across renders — it is read once per canvas generation. Define it at module
   * scope rather than inline in JSX, or the canvas will tear down and rebuild on every render.
   */
  createScene: HeroSceneFactory;
  /** Static image shown until the first frame is drawn. This is the hero's LCP element. */
  poster: string;
  className?: string;
};

/**
 * Owns the hero's WebGL lifecycle: renderer, rAF loop, resize, pausing, context loss and teardown.
 * Scene-agnostic by design — see `types.ts` for the contract.
 *
 * Two things here are load-bearing and easy to regress:
 *
 * - **The poster is the LCP element, not the canvas.** A WebGL hero that paints on first frame
 *   makes LCP hostage to shader compilation and asset decode. The poster renders immediately and
 *   the canvas is only initialised after the browser has gone idle, then cross-faded in.
 * - **Teardown must be total.** React StrictMode mounts effects twice in development; anything
 *   not disposed here leaks a GPU context and an rAF loop per remount, and browsers cap live
 *   WebGL contexts at ~16 before they start killing the oldest.
 */
export function BillboardHeroCanvas({ createScene, poster, className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  /** Set once if WebGL is unavailable. A ref, not state: the poster is already what is on
   *  screen, so there is nothing to re-render — this only stops the effect retrying. */
  const failedRef = useRef(false);

  const reducedMotion = useReducedMotion();
  /** Gate: hold the canvas back until after first paint so the poster wins LCP. */
  const [deferredReady, setDeferredReady] = useState(false);
  /** Bumped to force a clean rebuild after the GPU context is restored. */
  const [generation, setGeneration] = useState(0);
  /** First frame is on screen — safe to fade the poster out. */
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === 'function') {
      const handle = idle(() => setDeferredReady(true), { timeout: IDLE_TIMEOUT_MS });
      return () => window.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(() => setDeferredReady(true), IDLE_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el || !deferredReady || failedRef.current) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // No WebGL at all. The poster is already on screen and stays, so this only has to stop
      // the effect from retrying on every dependency change.
      failedRef.current = true;
      return;
    }

    const width = el.clientWidth || 1;
    const height = el.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.classList.add('block', 'h-full', 'w-full');
    el.appendChild(renderer.domElement);

    const heroScene = createScene({ renderer, width, height, reducedMotion });

    let raf = 0;
    let running = false;
    let intersecting = true;
    let suspended = false;
    let lost = false;
    let last = performance.now();
    let elapsed = 0;
    let firstFrameDrawn = false;

    const drawFrame = (dt: number) => {
      heroScene.update(dt, elapsed);
      renderer.render(heroScene.scene, heroScene.camera);
      if (!firstFrameDrawn) {
        firstFrameDrawn = true;
        setPainted(true);
      }
    };

    const tick = () => {
      if (!running) return;
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, MAX_DELTA);
      last = now;
      elapsed += dt;
      drawFrame(dt);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running || suspended || lost || !intersecting || reducedMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Reduced motion: one composed frame, never a loop. The scene is told, so it can present
    // itself settled rather than mid-transition.
    if (reducedMotion) {
      drawFrame(0);
    } else {
      startLoop();
    }

    const onSuspend = () => {
      suspended = true;
      stopLoop();
    };
    const onResume = () => {
      suspended = false;
      startLoop();
    };
    const onVisibility = () => {
      if (document.hidden) onSuspend();
      else onResume();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        if (intersecting) startLoop();
        else stopLoop();
      },
      { rootMargin: '20% 0px', threshold: 0 },
    );
    io.observe(el);

    // A lost context leaves a permanently black canvas unless it is caught. preventDefault()
    // is what makes `webglcontextrestored` fire at all.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      stopLoop();
      setPainted(false);
    };
    const onContextRestored = () => {
      // Every GPU object built against the old context is dead. Rebuild from scratch rather
      // than trying to revive them piecemeal.
      setGeneration((g) => g + 1);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      heroScene.resize(w, h);
      if (reducedMotion || !running) drawFrame(0);
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    // Shared with HeroLogo3D so both canvases suspend together rather than fighting for the GPU.
    window.addEventListener('hero3d:suspend', onSuspend);
    window.addEventListener('hero3d:resume', onResume);

    return () => {
      stopLoop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('hero3d:suspend', onSuspend);
      window.removeEventListener('hero3d:resume', onResume);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      heroScene.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [deferredReady, reducedMotion, generation, createScene]);

  return (
    <div className={cn('absolute inset-0', className)} aria-hidden>
      {/* LCP element. Stays mounted underneath the canvas so a lost context reveals it again
          instead of a black hole. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
          painted ? 'opacity-0' : 'opacity-100',
        )}
        draggable={false}
      />
      <div
        ref={mountRef}
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          painted ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
