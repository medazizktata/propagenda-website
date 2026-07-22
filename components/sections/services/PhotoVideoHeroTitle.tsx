'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

const PREFIXES = ['PHOTO', 'VIDEO'] as const;
const CYCLE_MS = 2200;
const TRANSITION_MS = 380;
/** Fixed prefix slot width (em × title size) — PHOTO sets the measure; VIDEO spreads to match. */
const PREFIX_SLOT_EM = 4.35;

function PrefixWord({ word }: { word: (typeof PREFIXES)[number] }) {
  if (word === 'VIDEO') {
    return (
      <span className="flex w-full justify-between bg-transparent" aria-hidden>
        {word.split('').map((ch, i) => (
          <span key={`${ch}-${i}`}>
            {ch}
          </span>
        ))}
      </span>
    );
  }
  return <span className="bg-transparent">{word}</span>;
}

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
          'font-sans font-bold uppercase leading-[0.9] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]',
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

  return (
    <h1
      className={cn(
        'font-sans font-bold uppercase leading-[0.9] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]',
        className,
      )}
      style={titleStyle}
      aria-label={`${PREFIXES[index]}GRAPHY — alternating with ${PREFIXES[(index + 1) % 2]}GRAPHY`}
    >
      <span className="inline-flex items-baseline justify-center whitespace-nowrap">
        <span
          className="relative inline-block overflow-hidden align-baseline bg-transparent"
          style={{ width: `${PREFIX_SLOT_EM}em`, height: '0.9em' }}
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
              <span
                key={p}
                className="flex h-[0.9em] items-end leading-[0.9]"
                style={{ width: `${PREFIX_SLOT_EM}em` }}
              >
                <PrefixWord word={p} />
              </span>
            ))}
          </span>
        </span>
        <span>GRAPHY</span>
        <span className="text-orange">.</span>
      </span>
      <span className="sr-only" aria-live="polite">
        {prefix}GRAPHY
      </span>
    </h1>
  );
}
