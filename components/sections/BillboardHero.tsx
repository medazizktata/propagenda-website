'use client';

import { ScrollCue } from '@/components/molecules/ScrollCue';
import { cn } from '@/components/ui/cn';
import { hero } from '@/content/site';
import { BillboardHeroCanvas } from './billboard-hero/BillboardHeroCanvas';
import { createPlaceholderScene } from './billboard-hero/placeholderScene';

/** The brand's "one word in orange" device (globals.css `.accent-word`). */
const ACCENT_WORD = 'CREATIVITY';
const POSTER = '/images/billboard-hero-poster.jpg';

/**
 * Home page opener: a field of OOH structures tumbling in a warm sky, under a completely
 * static type lockup.
 *
 * Modelled on the reference reel dissected in `docs/rework/reel-hero-dissection.md`. Two of
 * that document's findings shape this component:
 *
 * - **The type layer never moves and nothing ever passes in front of it.** The reference's DOM
 *   layer was rigid to within measurement error across all 324 frames, so there is deliberately
 *   no parallax, no scroll coupling and no per-character animation on the copy here.
 * - **The hero consumes no scroll.** It is an autoplaying idle loop, not a scrub, which is why
 *   this section is a plain 100vh block and does not pin. The showreel section below keeps its
 *   own pin.
 */
export function BillboardHero() {
  const lines = hero.h1.split(' ');

  return (
    <section data-seamless-act className="relative h-screen overflow-hidden bg-charcoal">
      <BillboardHeroCanvas createScene={createPlaceholderScene} poster={POSTER} />

      {/* Vignette + floor scrim so the lockup holds against the bright lower-right of the sky. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(5,5,6,0.55)_100%)]"
      />

      <div className="pointer-events-none relative z-[2] flex h-full flex-col items-center justify-center px-gutter-m lg:px-gutter-d">
        <h1
          className={cn(
            'flex flex-col items-start text-left font-sans font-bold uppercase text-white',
            'text-[clamp(2.4rem,11vw,8rem)] leading-[0.86] tracking-display',
            '[text-shadow:0_2px_14px_rgba(0,0,0,0.55)]',
          )}
        >
          {lines.map((word, i) => (
            <span key={`${word}-${i}`} className={cn(word === ACCENT_WORD && 'accent-word')}>
              {word}
            </span>
          ))}
        </h1>

        {/* Right-aligned under the lockup, echoing the reference's tagline placement. */}
        <p className="mt-5 self-end text-right text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-xs">
          {hero.subtitle}
        </p>
      </div>

      <ScrollCue label="Scroll to the showreel" className="z-[3]" />
    </section>
  );
}
