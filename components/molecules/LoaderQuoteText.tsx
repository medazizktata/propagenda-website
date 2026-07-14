'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import {
  loaderTextMotion,
  type InitLoaderQuote,
  type LoaderEntrance,
} from '@/content/initLoaderQuotes';
import { cn } from '@/components/ui/cn';

type LoaderQuoteTextProps = {
  quote: InitLoaderQuote;
  /** Restart the entrance when this changes (e.g. page-transition cover). */
  playKey?: string | number;
  className?: string;
  size?: 'init' | 'transition';
};

function playEntrance(
  tl: gsap.core.Timeline,
  words: HTMLElement[],
  entrance: LoaderEntrance,
) {
  switch (entrance) {
    case 'meet': {
      words.forEach((word, i) => {
        const fromLeft = i % 2 === 0;
        gsap.set(word, { xPercent: fromLeft ? -120 : 120, yPercent: 0, opacity: 0, scale: 1 });
        tl.to(
          word,
          { xPercent: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          i * 0.1,
        );
      });
      break;
    }
    case 'horizon': {
      words.forEach((word, i) => {
        gsap.set(word, { yPercent: 140, opacity: 0, scale: 1 });
        tl.to(
          word,
          { yPercent: -4, opacity: 1, duration: 0.6, ease: 'power2.out' },
          i * 0.12,
        ).to(word, { yPercent: 0, duration: 0.25, ease: 'power1.inOut' }, i * 0.12 + 0.55);
      });
      break;
    }
    case 'assemble': {
      words.forEach((word, i) => {
        gsap.set(word, { yPercent: 40, opacity: 0, scale: 0.72 });
        tl.to(
          word,
          { yPercent: 0, opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.6)' },
          i * 0.14,
        );
      });
      break;
    }
    case 'expose': {
      words.forEach((word, i) => {
        gsap.set(word, { scaleX: 0, opacity: 1, yPercent: 0, transformOrigin: 'left center' });
        tl.to(word, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, i * 0.11);
      });
      break;
    }
    case 'pulse': {
      words.forEach((word, i) => {
        gsap.set(word, {
          scale: 1.45,
          opacity: 0,
          yPercent: 20,
          rotation: i % 2 ? 2 : -2,
        });
        tl.to(
          word,
          {
            scale: 1,
            opacity: 1,
            yPercent: 0,
            rotation: 0,
            duration: 0.48,
            ease: 'power3.out',
          },
          i * 0.1,
        );
      });
      break;
    }
    case 'invite': {
      words.forEach((word, i) => {
        gsap.set(word, { yPercent: 30, opacity: 0, scale: 0.94 });
        tl.to(
          word,
          { yPercent: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
          i * 0.13,
        );
      });
      break;
    }
    case 'clarify': {
      words.forEach((word, i) => {
        gsap.set(word, { opacity: 0, yPercent: 0, scale: 1 });
        tl.to(word, { opacity: 1, duration: 0.12, ease: 'none' }, i * 0.07);
      });
      break;
    }
    case 'rise':
    default: {
      words.forEach((word, i) => {
        gsap.set(word, { yPercent: 110, opacity: 1, scale: 1, x: 0 });
        const at = i * 0.09;
        tl.to(word, { yPercent: 0, duration: 0.55, ease: 'power3.out' }, at)
          .to(word, { x: 3, duration: 0.04, ease: 'none' }, at + 0.42)
          .to(word, { x: -2, duration: 0.04, ease: 'none' }, at + 0.46)
          .to(word, { x: 0, duration: 0.05, ease: 'none' }, at + 0.5);
      });
      break;
    }
  }
}

/** Destination-aware quote entrance — no flipped attribution. */
export function LoaderQuoteText({
  quote,
  playKey = 0,
  className,
  size = 'init',
}: LoaderQuoteTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const s = loaderTextMotion.sizeScale;
  const fontSize =
    size === 'init'
      ? `clamp(${2.5 * s}rem, ${10.5 * s}vw, ${7.5 * s}rem)`
      : `clamp(${2.25 * s}rem, ${9 * s}vw, ${6.5 * s}rem)`;
  const entrance: LoaderEntrance = quote.entrance ?? 'rise';

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const words = Array.from(root.querySelectorAll<HTMLElement>('.loader-quote-word'));

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        timeScale: loaderTextMotion.speed,
      });
      playEntrance(tl, words, entrance);
    }, root);

    return () => ctx.revert();
  }, [quote, playKey, entrance]);

  return (
    <div ref={rootRef} className={cn('flex flex-col items-center px-2 text-center', className)}>
      <p className="flex flex-col items-center font-sans font-bold uppercase leading-[0.88] tracking-tight text-navy">
        {quote.lines.map((line) => (
          <span
            key={line}
            className={cn(
              'loader-quote-line block',
              (entrance === 'rise' ||
                entrance === 'assemble' ||
                entrance === 'invite' ||
                entrance === 'horizon') &&
                'overflow-hidden',
            )}
          >
            <span className="loader-quote-word block will-change-transform" style={{ fontSize }}>
              {line}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}
