'use client';

import { useRef, useEffect, Fragment } from 'react';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { manifestoAttribution, manifestoQuote } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

// SMV's signature scroll effect: the statement starts dim (but visible) and brightens
// word-by-word as you scroll through — never invisible.
const ACCENT_WORDS = new Set(['brand’s', "brand's", 'story', 'story.']);

export function ManifestoSection() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const ctx = gsap.context(() => {
      // Brighten plays across the smooth sticky GLIDE + HOLD: it launches the moment the
      // words rise into view (mid-transition from the hero — no GSAP pin, so no snap),
      // keeps revealing word-by-word as the panel eases up and locks, and finishes during
      // the sticky hold. You watch the reveal happen; you're never snapped in first.
      gsap.fromTo(
        containerRef.current!.querySelectorAll('.mf-word'),
        { opacity: 0.08 },
        {
          opacity: 1,
          ease: 'none',
          duration: 0.25,
          stagger: { amount: 1.1 },
          scrollTrigger: {
            trigger: containerRef.current,
            // Start brightening the moment the panel ENTERS the viewport (bottom edge), so it
            // reads as content scrolling in during the hero→manifesto handoff — not as a big
            // dim/empty gap while it silently rises. Continues across the lock + sticky hold.
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const words = manifestoQuote.split(' ');

  return (
    <section ref={containerRef} data-seamless-act className="relative h-[200vh]">
      <div
        ref={stickyRef}
        // Transparent over SeamlessActs charcoal + tiled pattern — one continuous surface.
        className="manifesto-pin sticky top-0 flex h-screen items-center overflow-hidden bg-charcoal px-gutter-m lg:px-gutter-d"
      >
        <div className="pattern-section-fade pointer-events-none absolute inset-0">
          <BrandPattern variant="frame" id="manifesto" half="right" />
        </div>
        <blockquote className="relative z-content w-full min-w-0 max-w-4xl">
          <span
            aria-hidden
            className="mb-[-0.35em] block font-sans text-[9rem] leading-none text-orange"
          >
            &ldquo;
          </span>
          <p className="font-sans text-display-xs font-bold uppercase leading-[1.1] tracking-display text-white">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className={cn('mf-word', ACCENT_WORDS.has(word) && 'text-orange')}>{word}</span>
                {i < words.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
            {/* Closing quote mark — an mf-word so it brightens in with the final words. */}
            <span aria-hidden className="mf-word text-orange">&rdquo;</span>
          </p>
          {/* Attribution is revealed by scroll too: the rule + name are mf-words, so they
              brighten in right after the quote finishes. */}
          <footer className="mt-12 flex items-center gap-4">
            <span aria-hidden className="mf-word h-0.5 w-14 bg-orange" />
            <cite className="mf-word font-sans text-2xl font-bold uppercase not-italic tracking-wide text-white lg:text-3xl">
              {manifestoAttribution}
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
