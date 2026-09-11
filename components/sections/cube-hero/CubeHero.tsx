'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

import type { CubeSceneHandle } from './cubeScene';
import { CUBE_SERVICES } from './services';

/**
 * PROPAGENDA — cube hero.
 *
 * The composition is a two-beat read. Upper left: the name, set as large as its column allows.
 * Right, at the golden third: a single cube the size of a room, turning through the agency's
 * seven disciplines a quarter turn at a time, standing in a pool of warm light with a field of
 * smaller cubes receding behind it. Bottom edge: a rail that names whatever the cube is showing
 * and counts down to the next turn.
 *
 * One protagonist, one orange. The brand colour appears on exactly one surface — whichever face
 * is squarely turned to camera — so the eye always knows where to land, and the cube's rotation
 * and its highlight are the same event rather than two things kept in sync.
 *
 * The DOM layer is not a caption on the canvas; it is the hero. Every word here is real text and
 * survives WebGL failing, reduced motion, or a crawler that never runs the scene at all.
 */

/** Tailwind cannot express a gradient this specific without becoming unreadable. */
const FALLBACK_GROUND =
  'radial-gradient(115% 85% at 71% 52%, rgba(245, 139, 39, 0.13), rgba(245, 139, 39, 0) 62%),' +
  'radial-gradient(90% 80% at 8% 4%, rgba(51, 80, 110, 0.16), rgba(51, 80, 110, 0) 55%),' +
  'radial-gradient(120% 120% at 50% 30%, #141417 0%, #040405 78%)';

export function CubeHero() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let cancelled = false;
    let handle: CubeSceneHandle | null = null;
    let cancelSchedule = () => {};
    const teardown: Array<() => void> = [];

    const attach = (scene: CubeSceneHandle) => {
      let onScreen = false;
      const syncActive = () => scene.setActive(onScreen && !document.hidden);

      const intersection = new IntersectionObserver(
        (entries) => {
          onScreen = entries[entries.length - 1].isIntersecting;
          syncActive();
        },
        // Any sliver on screen counts; a hero that stops rendering as its last row scrolls past
        // would visibly freeze mid-turn.
        { threshold: 0 },
      );
      intersection.observe(section);
      teardown.push(() => intersection.disconnect());

      document.addEventListener('visibilitychange', syncActive);
      teardown.push(() => document.removeEventListener('visibilitychange', syncActive));

      const resize = new ResizeObserver(() => scene.resize());
      resize.observe(section);
      teardown.push(() => resize.disconnect());

      // Pointer parallax is a fine-pointer affordance only: on touch the "pointer" is a tap and
      // the tilt would arrive as a jolt.
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
      if (fine.matches && !reducedMotion) {
        let rect = section.getBoundingClientRect();
        const refreshRect = () => {
          rect = section.getBoundingClientRect();
        };
        const move = (event: PointerEvent) => {
          scene.setPointer(
            ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
            ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1,
          );
        };
        const leave = () => scene.setPointer(0, 0);
        section.addEventListener('pointermove', move);
        section.addEventListener('pointerleave', leave);
        window.addEventListener('scroll', refreshRect, { passive: true });
        window.addEventListener('resize', refreshRect);
        teardown.push(() => {
          section.removeEventListener('pointermove', move);
          section.removeEventListener('pointerleave', leave);
          window.removeEventListener('scroll', refreshRect);
          window.removeEventListener('resize', refreshRect);
        });
      }

      syncActive();
    };

    const boot = async () => {
      if (cancelled) return;
      try {
        // three and the whole post chain are pulled in here, not at module scope, so none of it
        // lands in the bundle that has to paint the headline.
        const { createCubeScene } = await import('./cubeScene');
        if (cancelled) return;
        const scene = createCubeScene({
          canvas,
          container: section,
          reducedMotion,
          // Nothing in the DOM tracks the turning any more, so this is a sink. Kept because the
          // scene requires it, and because re-introducing state here would mean a React render
          // on every beat for something no longer rendered.
          onService: () => {},
          onReady: () => setSceneReady(true),
        });
        // The effect's cleanup may have run while the dynamic import was in flight.
        if (cancelled) {
          scene.dispose();
          return;
        }
        handle = scene;
        attach(scene);
      } catch {
        // No WebGL, or the context was refused. The DOM hero is already complete on its own and
        // the CSS ground stays visible, so there is nothing to fall back to.
      }
    };

    // Waiting on fonts matters: the face tiles are drawn with the same Poppins and IBM Plex Mono
    // as the DOM, and building the atlas early would bake the fallback stack into a texture.
    const start = () => {
      const fonts: Promise<unknown> = document.fonts ? document.fonts.ready : Promise.resolve();
      void fonts.then(boot, boot);
    };

    if (typeof window.requestIdleCallback === 'function') {
      // The timeout is the backstop for a page that never goes idle.
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      cancelSchedule = () => window.cancelIdleCallback(id);
    } else {
      const id = window.setTimeout(start, 260);
      cancelSchedule = () => window.clearTimeout(id);
    }

    return () => {
      cancelled = true;
      cancelSchedule();
      for (const off of teardown) off();
      teardown.length = 0;
      handle?.dispose();
      handle = null;
      setSceneReady(false);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      data-seamless-act
      className="relative h-screen overflow-hidden bg-charcoal"
    >
      {/* The ground. Also the entire picture if WebGL never arrives. */}
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: FALLBACK_GROUND }} />

      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          'absolute inset-0 block h-full w-full transition-opacity duration-1000 ease-out',
          sceneReady ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="relative z-content mx-auto flex h-full w-full max-w-[1800px] flex-col px-6 sm:px-10 lg:px-14">
        {/* Sits off the bottom rather than on it. Flush against the edge put the call to action
            under the dock or the browser's own chrome in a short window, and the copy read as
            having fallen to the floor of the frame. */}
        <div className="flex min-h-0 flex-1 flex-col justify-end pb-[clamp(3.5rem,11vh,6rem)] pt-[calc(var(--header-height)+1rem)] lg:justify-center lg:pb-0">
          {/* The column is its own containment context, so the wordmark can be sized in cqw. */}
          <div className="w-full lg:w-1/2" style={{ containerType: 'inline-size' }}>
            <h1
              className="text-[clamp(2.5rem,9vw,6rem)] font-extrabold uppercase leading-[0.85] tracking-[0.01em] text-white"
              // PROPAGENDA measures 7.13em in Poppins ExtraBold caps, so 12.6cqw lands it at ~90%
              // of its column at every width — one invariant instead of a clamp per breakpoint.
              // Browsers without container units simply drop this and keep the clamp above.
              style={{ fontSize: '12.6cqw' }}
            >
              Propagenda
            </h1>

            <p className="mt-6 max-w-measure-lead text-[clamp(0.95rem,1.5vw,1.125rem)] leading-relaxed text-white/65">
              One team for the whole arc — from the first idea to the final frame.
            </p>

            {/* The disciplines as real, ordered text. The cube is the performance; this is the
                record, and it is what a screen reader and a crawler actually get. */}
            <ol className="sr-only">
              {CUBE_SERVICES.map((service) => (
                <li key={service.name}>{service.name}</li>
              ))}
            </ol>

            {/* One call to action. A second button here was pulling the eye into a choice
                before the hero had finished making its point. */}
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-pill bg-orange px-6 py-3 text-sm font-semibold text-ink transition-hover hover:bg-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              Start a project
              <span
                aria-hidden
                className="transition-transform duration-fast group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CubeHero;
