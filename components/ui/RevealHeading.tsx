'use client';

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

type RevealHeadingProps = {
  /** Rendered element. Defaults to h2. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Extra delay before the lines rise, in seconds. */
  delay?: number;
};

/**
 * Cuberto-style heading reveal. The heading is split into lines, each masked inside an
 * overflow-hidden clip, and the lines rise into place on a long `expo.out` glide when the
 * heading scrolls into view — content is *unveiled from behind a mask*, not faded in.
 *
 * Discipline (matching the rest of the motion system):
 * - Reduced motion → renders the heading statically, no split.
 * - Splits only after fonts settle, so the line breaks are the real ones.
 * - Reverts the split once the reveal finishes, so the DOM reflows normally on resize.
 * - Anti-blank-page: an in-view fallback reveals the heading if the ScrollTrigger ever
 *   desyncs (e.g. behind a pinned section), so a heading can never be stranded hidden.
 */
export function RevealHeading({ as: Tag = 'h2', className, style, children, delay = 0 }: RevealHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    registerGsap();

    let split: SplitText | null = null;
    let trigger: ScrollTrigger | null = null;
    let fallback = 0;
    let revealed = false;
    let cancelled = false;

    const reveal = () => {
      if (revealed || !split) return;
      revealed = true;
      window.clearTimeout(fallback);
      gsap.to(split.lines, {
        yPercent: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        delay,
        onComplete: () => split?.revert(),
      });
    };

    const build = () => {
      if (cancelled || !ref.current) return;
      split = new SplitText(el, { type: 'lines', mask: 'lines' });
      gsap.set(split.lines, { yPercent: 110 });
      trigger = ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: reveal });
      // If the trigger desyncs but the heading is already on screen, don't leave it hidden.
      fallback = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) reveal();
      }, 2200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(build).catch(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      trigger?.kill();
      split?.revert();
    };
  }, [reduced, delay]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
