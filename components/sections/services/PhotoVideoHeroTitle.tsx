'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

const PREFIXES = ['PHOTO', 'VIDEO'] as const;
const SUFFIX = 'GRAPHY';
const CYCLE_MS = 2200;
const TRANSITION_MS = 420;
/** Suffix kerning eases to match the new prefix after the prefix has started moving. */
const SUFFIX_KERNING_DELAY_MS = 150;

const KERNING: Record<(typeof PREFIXES)[number], string> = {
  PHOTO: '0.02em',
  VIDEO: '0.028em',
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function PhotoVideoHeroTitle({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PREFIXES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const titleStyle = { fontSize: 'clamp(2.4rem, 8.5vw, 7rem)' } as const;

  if (reducedMotion) {
    return (
      <h1
        className={cn(
          'font-sans font-bold uppercase leading-[0.9] text-white',
          className,
        )}
        style={titleStyle}
      >
        PHOTOGRAPHY &amp; VIDEOGRAPHY
        <span className="text-orange">.</span>
      </h1>
    );
  }

  const prefix = PREFIXES[index];
  const kerning = KERNING[prefix];

  return (
    <h1
      className={cn(
        'font-sans font-bold uppercase leading-[0.9] text-white',
        className,
      )}
      style={titleStyle}
      aria-label="Photography and Videography — alternating headline"
    >
      <span className="inline-flex items-baseline justify-center whitespace-nowrap">
        <span
          className="relative inline-block overflow-hidden bg-transparent align-bottom [box-shadow:none]"
          style={{
            height: '0.9em',
            letterSpacing: kerning,
            transition: `letter-spacing ${TRANSITION_MS}ms ${EASE}`,
          }}
          aria-hidden
        >
          <span
            className="flex flex-col bg-transparent ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:transition-transform"
            style={{
              transitionDuration: `${TRANSITION_MS}ms`,
              transform: `translateY(-${index * (100 / PREFIXES.length)}%)`,
            }}
          >
            {PREFIXES.map((p) => (
              <span key={p} className="block h-[0.9em] leading-[0.9]">
                {p}
              </span>
            ))}
          </span>
        </span>
        <span
          className="align-baseline"
          style={{
            letterSpacing: kerning,
            transition: `letter-spacing ${TRANSITION_MS}ms ${EASE}`,
            transitionDelay: `${SUFFIX_KERNING_DELAY_MS}ms`,
          }}
          aria-hidden
        >
          {SUFFIX}
        </span>
        <span className="text-orange">.</span>
      </span>
      <span className="sr-only" aria-live="polite">
        {prefix}
        {SUFFIX}
      </span>
    </h1>
  );
}
