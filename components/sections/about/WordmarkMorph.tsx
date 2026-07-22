'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/components/ui/cn';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

interface WordmarkMorphProps {
  prefix: string;
  from: string;
  to: string;
  suffix: string;
  className?: string;
}

/**
 * The signature About moment: the name transforms in place — propag[A]nda -> propag[E]nda.
 * The "A" lifts out and dims while the orange "E" rises into its slot with a flash. Runs once
 * on load (after the intro window) and replays on hover / focus.
 *
 * Accessibility: the whole mark is decorative (aria-hidden); the section supplies the real
 * accessible heading text.
 *
 * Legible-by-default: the RESOLVED letter (orange E) is the static default — it renders on
 * SSR, with no JS, and under reduced motion, so the mark always reads "PROPAGENDA". The A is
 * hidden by default (`opacity-0`) and is only summoned by the morph animation, which lifts it
 * out and rises the E back into its slot. If the script never runs, nothing is ever blank.
 *
 * The morph slot is a plain inline-block sized by an invisible copy of the final letter — no
 * `overflow: hidden`, so the slot keeps its text baseline and the A/E stay on the type line.
 */
export function WordmarkMorph({ prefix, from, to, suffix, className }: WordmarkMorphProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    const flashEl = flashRef.current;
    if (!fromEl || !toEl) return;

    // Default (no-JS / reduced) already shows the resolved E; under reduced motion we simply
    // leave it — no morph, nothing hidden that a trigger would need to reveal.
    if (reducedMotion) {
      gsap.set(fromEl, { autoAlpha: 0 });
      gsap.set(toEl, { autoAlpha: 1, yPercent: 0 });
      return;
    }

    const play = () => {
      gsap.killTweensOf([fromEl, toEl, flashEl]);
      const tl = gsap.timeline();
      tl.set(fromEl, { autoAlpha: 1, yPercent: 0, scale: 1, color: 'rgba(255,255,255,0.85)' })
        .set(toEl, { autoAlpha: 0, yPercent: 72, scale: 1.18 });
      if (flashEl) tl.set(flashEl, { autoAlpha: 0, scaleY: 0.25 });
      // Turn off the A.
      tl.to(fromEl, { yPercent: -70, autoAlpha: 0, ease: 'power3.in', duration: 0.42 }, 0.15);
      // Flash the slot orange as the letter swaps.
      if (flashEl) {
        tl.to(flashEl, { autoAlpha: 0.85, scaleY: 1, ease: 'power2.out', duration: 0.22 }, 0.32)
          .to(flashEl, { autoAlpha: 0, ease: 'power2.in', duration: 0.55 }, 0.55);
      }
      // Turn on the E.
      tl.to(
        toEl,
        { yPercent: 0, scale: 1, autoAlpha: 1, ease: 'power3.out', duration: 0.55 },
        0.44,
      );
    };

    // Play once after the intro-loader window has cleared the hero.
    const delay = gsap.delayedCall(0.65, play);

    const root = rootRef.current;
    const replay = () => play();
    root?.addEventListener('mouseenter', replay);

    return () => {
      delay.kill();
      gsap.killTweensOf([fromEl, toEl, flashEl]);
      root?.removeEventListener('mouseenter', replay);
    };
  }, [reducedMotion]);

  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      className={cn('inline-flex items-baseline leading-[0.82]', className)}
    >
      <span>{prefix}</span>
      {/* Morph slot — the resolved letter (E) sizes the box; A and E are overlaid inside. */}
      <span className="relative inline-block align-baseline">
        {/* Invisible sizer keeps the slot exactly one glyph wide and on the baseline. */}
        <span className="invisible" aria-hidden>
          {to}
        </span>
        <span
          ref={flashRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-[-0.08em] bottom-[0.08em] top-[0.08em] origin-bottom rounded-[0.08em] bg-orange/80 opacity-0 blur-[3px]"
        />
        {/* A — hidden by default; the morph animation summons it, then lifts it away. */}
        <span
          ref={fromRef}
          className="absolute left-0 top-0 block w-full text-center text-white/85 opacity-0"
        >
          {from}
        </span>
        {/* E — the resolved letter, visible by default so the mark always reads "PROPAGENDA". */}
        <span ref={toRef} className="absolute left-0 top-0 block w-full text-center text-orange">
          {to}
        </span>
      </span>
      <span>{suffix}</span>
    </span>
  );
}
