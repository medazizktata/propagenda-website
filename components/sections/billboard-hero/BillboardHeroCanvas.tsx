'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import {
  clearOverlayPointerTarget,
  getOverlayPointerTarget,
  setOverlayPointerTarget,
  type OverlayPointerTarget,
} from './overlayPointer';
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
  /**
   * Static image shown until the first frame is drawn — the hero's LCP element.
   *
   * Omit it for an overlay layer, which has nothing to stand in for: a poster there would sit
   * as an opaque plate over whatever the layer beneath it is already showing.
   */
  poster?: string;
  /**
   * Clear to transparent instead of painting the scene's background, so the layers below show
   * through. Required for any canvas stacked over another.
   */
  transparent?: boolean;
  /**
   * Which half of the stacked pair this is.
   *
   * `base` (default) owns pointer input for both layers: it listens, and asks the registered
   * overlay whether it wants each hit before trying its own scene. `overlay` attaches no
   * listeners at all — it cannot, being `pointer-events: none` — and instead registers its
   * scene so the base can hit-test it. See `overlayPointer.ts`.
   */
  role?: 'base' | 'overlay';
  /**
   * Caps device pixel ratio. Worth lowering for a sparse overlay, where a full-resolution
   * buffer costs the same fill as the main scene to draw a couple of objects.
   */
  maxPixelRatio?: number;
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
export function BillboardHeroCanvas({
  createScene,
  poster,
  transparent,
  role = 'base',
  maxPixelRatio = 2,
  className,
}: Props) {
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
        alpha: transparent === true,
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
    if (transparent) renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setSize(width, height);
    renderer.domElement.classList.add('block', 'h-full', 'w-full');
    el.appendChild(renderer.domElement);

    // Assigned once drawOnce exists below. The scene is constructed first, so the callback it
    // receives has to reach the real function indirectly.
    let drawOnceFn: (() => void) | null = null;
    const heroScene = createScene({
      renderer,
      width,
      height,
      reducedMotion,
      requestDraw: () => drawOnceFn?.(),
    });

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
      if (heroScene.render) heroScene.render(renderer);
      else renderer.render(heroScene.scene, heroScene.camera);
      if (!firstFrameDrawn) {
        firstFrameDrawn = true;
        setPainted(true);
      }
    };

    let dragging = false;
    let hoverX = 0;
    let hoverY = 0;
    let hoverDirty = false;
    /** Whichever scene claimed the current drag — the overlay's or this canvas's own. */
    let dragTarget: OverlayPointerTarget | null = null;

    const setCursor = (value: string) => {
      renderer.domElement.style.cursor = value;
    };

    /** Hover picking raycasts the whole field, so it runs once per frame, not once per event —
     *  a 1000 Hz pointer otherwise fires several redundant raycasts between two frames, all but
     *  the last of them thrown away, on the same thread the loop is trying to render on. */
    const applyHover = () => {
      if (!hoverDirty || dragging) return;
      hoverDirty = false;
      // Overlay first: it is drawn on top, so it is what the pointer is actually over.
      const overlay = getOverlayPointerTarget();
      const hot =
        (overlay?.pointerMove?.(hoverX, hoverY) ?? false) ||
        (heroScene.pointerMove?.(hoverX, hoverY) ?? false);
      setCursor(hot ? 'grab' : '');
    };

    const tick = () => {
      if (!running) return;
      applyHover();
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, MAX_DELTA);
      last = now;
      elapsed += dt;
      drawFrame(dt);
      raf = requestAnimationFrame(tick);
    };

    /**
     * One frame outside the loop — after a resize, or while dragging with the loop stopped.
     *
     * The delta is real rather than zero because the scene integrates on it: the drag spring
     * would never advance on `drawFrame(0)`. Under reduced motion it stays zero on purpose, so
     * the frame composes without anything animating, and the scene tracks the drag directly.
     */
    const drawOnce = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, MAX_DELTA);
      last = now;
      if (reducedMotion) {
        drawFrame(0);
        return;
      }
      elapsed += dt;
      drawFrame(dt);
    };

    drawOnceFn = drawOnce;

    /** This canvas's own scene, in the same shape the overlay registry uses, so the drag
     *  routing below can hold either one in a single variable. */
    const ownTarget: OverlayPointerTarget = {
      pointerMove: heroScene.pointerMove?.bind(heroScene),
      pointerDown: heroScene.pointerDown?.bind(heroScene),
      pointerDrag: heroScene.pointerDrag?.bind(heroScene),
      pointerUp: heroScene.pointerUp?.bind(heroScene),
      requestDraw: drawOnce,
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

    const toNdc = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      return {
        x: ((event.clientX - rect.left) / w) * 2 - 1,
        y: -((event.clientY - rect.top) / h) * 2 + 1,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const { x, y } = toNdc(event);
      if (dragging) {
        dragTarget?.pointerDrag?.(x, y);
        if (reducedMotion || !running) {
          drawOnce();
          // The overlay runs its own loop, so it only needs telling when nothing is looping.
          if (dragTarget !== ownTarget) dragTarget?.requestDraw();
        }
        return;
      }
      hoverX = x;
      hoverY = y;
      hoverDirty = true;
      // With no loop to piggyback on there is nothing to defer to.
      if (!running) applyHover();
    };
    const onPointerLeave = () => {
      hoverDirty = false;
      if (!dragging) setCursor('');
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const { x, y } = toNdc(event);
      const overlay = getOverlayPointerTarget();
      if (overlay?.pointerDown?.(x, y)) dragTarget = overlay;
      else if (heroScene.pointerDown?.(x, y)) dragTarget = ownTarget;
      else return;
      dragging = true;
      setCursor('grabbing');
      // Throws NotFoundError if the pointer is already gone — a fast click can beat this line.
      // The drag still works without capture; it just stops tracking outside the canvas.
      try {
        renderer.domElement.setPointerCapture(event.pointerId);
      } catch {
        /* no capture available */
      }
      event.preventDefault();
    };
    const endDrag = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const { x, y } = toNdc(event);
      dragTarget?.pointerUp?.(x, y);
      const releasedOverlay = dragTarget !== ownTarget ? dragTarget : null;
      dragTarget = null;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      const overlay = getOverlayPointerTarget();
      const hot =
        (overlay?.pointerMove?.(x, y) ?? false) || (heroScene.pointerMove?.(x, y) ?? false);
      setCursor(hot ? 'grab' : '');
      hoverDirty = false;
      if (reducedMotion || !running) {
        drawOnce();
        releasedOverlay?.requestDraw();
      }
    };
    if (role === 'overlay') {
      // No listeners: this canvas is pointer-events: none, so it would never receive any. It
      // publishes its hit-test instead, and the base canvas calls into it.
      setOverlayPointerTarget(ownTarget);
    } else {
      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerleave', onPointerLeave);
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointerup', endDrag);
      renderer.domElement.addEventListener('pointercancel', endDrag);
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
      if (reducedMotion || !running) drawOnce();
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
      clearOverlayPointerTarget(ownTarget);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', endDrag);
      renderer.domElement.removeEventListener('pointercancel', endDrag);
      heroScene.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [deferredReady, reducedMotion, generation, createScene, transparent, role, maxPixelRatio]);

  return (
    <div className={cn('absolute inset-0', className)} aria-hidden>
      {/* LCP element. Stays mounted underneath the canvas so a lost context reveals it again
          instead of a black hole. */}
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className={cn(
            'pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            painted ? 'opacity-0' : 'opacity-100',
          )}
          draggable={false}
        />
      ) : null}
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
