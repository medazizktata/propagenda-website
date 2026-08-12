'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { cn } from '@/components/ui/cn';

const FINE = '(hover: hover) and (pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

/** Live: fine+hover pointer with motion allowed. SSR/hydration snapshot is `false`
 *  (static line) so there's no mismatch; it re-reads if the media queries change. */
function useInteractivePointer(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const a = window.matchMedia(FINE);
      const b = window.matchMedia(REDUCED);
      a.addEventListener('change', onChange);
      b.addEventListener('change', onChange);
      return () => {
        a.removeEventListener('change', onChange);
        b.removeEventListener('change', onChange);
      };
    },
    () => window.matchMedia(FINE).matches && !window.matchMedia(REDUCED).matches,
    () => false,
  );
}

export interface ElasticLineProps {
  /** Resting stroke colour. Default: subtle white (design's white/20). */
  color?: string;
  /** Stroke colour while the string is plucked. Default: brand orange. */
  activeColor?: string;
  /** Stroke thickness in px. Default 1.5. */
  thickness?: number;
  /**
   * Height of the invisible pointer hit-zone band (px). The line reacts from this
   * distance, and it's the vertical room the bend rides in. Default 40.
   */
  hitZone?: number;
  /**
   * Vertical pull multiplier. 1 = the control point sits exactly under the cursor;
   * higher amplifies the bend (the SVG is overflow-visible so it never clips). Default 1.3.
   */
  strength?: number;
  /** Render the small node dot that rides the line under the cursor. Default true. */
  node?: boolean;
  className?: string;
}

/**
 * Cuberto-style "elastic string" divider. A full-width SVG quadratic-bezier `<path>`
 * that is straight at rest (control point centred on the chord). While the cursor is
 * inside the hit-zone the control point tracks it (x + y) so the line bends toward the
 * cursor, with a small node riding the curve underneath; on pointer-leave the control
 * point springs back to centre with an `elastic.out` ease — the catch-and-release.
 *
 * Coarse pointers and `prefers-reduced-motion` get a plain static line, no listeners.
 * Pointer events live only on the hit-zone; motion is throttled through gsap.ticker and
 * everything is torn down on unmount. Decorative — hidden from assistive tech.
 */
export function ElasticLine({
  color = 'rgba(255,255,255,0.09)',
  activeColor = '#f58b27',
  thickness = 1.5,
  hitZone = 40,
  strength = 2.2,
  node = true,
  className,
}: ElasticLineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodeRef = useRef<SVGCircleElement>(null);
  const interactive = useInteractivePointer();

  useEffect(() => {
    if (!interactive) return;
    const wrap = wrapRef.current;
    const path = pathRef.current;
    const dot = nodeRef.current;
    if (!wrap || !path) return;

    const clamp = gsap.utils.clamp;
    const H = hitZone;
    const midY = H / 2;
    let W = wrap.clientWidth;

    // The animated control point (starts centred on the chord → dead-straight line).
    const ctrl = { x: W / 2, y: midY };
    const target = { x: W / 2, y: midY };
    let px = W / 2; // pointer x — where the node rides
    let mode: 'idle' | 'follow' = 'idle';
    let releaseTween: gsap.core.Tween | null = null;

    // Rebuild the path `d` from the current control point, and drop the node onto the
    // curve at the pointer's x (solve the quadratic for t so it truly rides the line).
    const draw = () => {
      const cx = ctrl.x;
      const cy = ctrl.y;
      path.setAttribute('d', `M0,${midY} Q${cx},${cy} ${W},${midY}`);
      if (!dot) return;
      const a = W - 2 * cx;
      const b = 2 * cx;
      let t: number;
      if (Math.abs(a) < 1e-4) {
        t = px / (W || 1);
      } else {
        const disc = Math.sqrt(Math.max(0, b * b + 4 * a * px));
        t = (-b + disc) / (2 * a);
        if (t < 0 || t > 1) t = (-b - disc) / (2 * a);
      }
      t = clamp(0, 1, t);
      const mt = 1 - t;
      const ny = mt * mt * midY + 2 * mt * t * cy + t * t * midY;
      dot.setAttribute('cx', String(px));
      dot.setAttribute('cy', String(ny));
    };

    // rAF-throttled follow: ease the control point toward the cursor each frame.
    const tick = () => {
      if (mode !== 'follow') return;
      ctrl.x += (target.x - ctrl.x) * 0.25;
      ctrl.y += (target.y - ctrl.y) * 0.25;
      draw();
    };

    const startFollow = () => {
      releaseTween?.kill();
      releaseTween = null;
      if (mode !== 'follow') {
        mode = 'follow';
        gsap.ticker.add(tick);
      }
      gsap.to(path, { stroke: activeColor, duration: 0.25, overwrite: true });
      if (dot) gsap.to(dot, { opacity: 1, duration: 0.2, overwrite: true });
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      px = clamp(0, W, e.clientX - rect.left);
      const localY = e.clientY - rect.top;
      target.x = px;
      // Control point tracks the cursor; strength amplifies the pull past it.
      target.y = clamp(-H, 2 * H, midY + (localY - midY) * strength);
      if (mode !== 'follow') startFollow();
    };

    // Catch-and-release: spring the control point back to centre, elastically.
    const onLeave = () => {
      mode = 'idle';
      gsap.ticker.remove(tick);
      gsap.to(path, { stroke: color, duration: 0.4, overwrite: true });
      if (dot) gsap.to(dot, { opacity: 0, duration: 0.3, overwrite: true });
      releaseTween = gsap.to(ctrl, {
        x: W / 2,
        y: midY,
        duration: 1.3,
        // Bigger overshoot + more bounce on the catch-and-release.
        ease: 'elastic.out(1.4, 0.28)',
        overwrite: true,
        onUpdate: draw,
      });
    };

    // Keep coordinates in sync with the element's real pixel width.
    const ro = new ResizeObserver(() => {
      W = wrap.clientWidth;
      if (mode === 'idle' && !releaseTween?.isActive()) {
        ctrl.x = W / 2;
        ctrl.y = midY;
        px = W / 2;
      }
      draw();
    });
    ro.observe(wrap);

    path.style.stroke = color;
    path.style.strokeWidth = String(thickness);
    if (dot) dot.style.fill = activeColor;
    draw();

    wrap.addEventListener('pointerenter', startFollow);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      wrap.removeEventListener('pointerenter', startFollow);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
      gsap.ticker.remove(tick);
      releaseTween?.kill();
      gsap.killTweensOf([path, ctrl]);
      if (dot) gsap.killTweensOf(dot);
    };
  }, [interactive, color, activeColor, thickness, hitZone, strength, node]);

  // Static fallback — coarse pointer / reduced motion / pre-hydration.
  if (!interactive) {
    return (
      <div
        aria-hidden
        data-elastic-line="static"
        className={cn('relative w-full', className)}
        style={{ height: hitZone }}
      >
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{ height: thickness, background: color }}
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden
      data-elastic-line="interactive"
      className={cn('relative w-full', className)}
      style={{ height: hitZone, touchAction: 'none' }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible [will-change:transform]"
        width="100%"
        height={hitZone}
        aria-hidden
      >
        <path ref={pathRef} fill="none" strokeLinecap="round" />
        {node ? <circle ref={nodeRef} r={Math.max(2.5, thickness + 2)} opacity={0} /> : null}
      </svg>
    </div>
  );
}
