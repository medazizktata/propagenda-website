'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Hero360Mark } from '@/components/molecules/Hero360Mark';
import { ScrollCue } from '@/components/molecules/ScrollCue';
import { cn } from '@/components/ui/cn';
import { billboardHero } from '@/content/site';
import { BillboardHeroCanvas } from './billboard-hero/BillboardHeroCanvas';
import { createBillboardScene } from './billboard-hero/billboardScene';
import { createForegroundScene } from './billboard-hero/foregroundScene';

const POSTER = '/images/billboard-hero-poster.jpg';

/**
 * Home page opener: a field of OOH structures tumbling in a warm sky, under a completely
 * static type lockup.
 *
 * Modelled on the reference reel dissected in `docs/rework/reel-hero-dissection.md`. Two of
 * that document's findings shape this component:
 *
 * - **The type layer never moves.** The reference's DOM layer was rigid to within measurement
 *   error across all 324 frames, so there is deliberately no parallax, no scroll coupling and no
 *   per-character animation on the copy here. The reference also never let anything cross in
 *   front of the type; that part has been overridden on request, by the near layer below.
 * - **The hero consumes no scroll.** It is an autoplaying idle loop, not a scrub, which is why
 *   this section is a plain 100vh block and does not pin. The showreel section below keeps its
 *   own pin.
 *
 * Lockup is the brand name over a single row holding the positioning line and the role. The
 * reference carried a follow-up sentence centred beneath instead; that was dropped deliberately,
 * because the field behind the type is busy and in motion and every extra line of quiet copy
 * competes with it for legibility. Keeping these two on one row costs no vertical space.
 */
export function BillboardHero() {
  // The mark is a live, spinning element rather than a glyph, so the line is split around it.
  const partnerParts = billboardHero.partner.split('360°');
  /**
   * The near layer is desktop-only. Its bands are fractions of the visible frame, so on a phone
   * the same structures land far closer to the lockup relative to the type's size and sit on the
   * copy rather than clipping the edge of the name. It is a depth device that needs room, and
   * skipping it also spares a phone a second WebGL context.
   */
  const hasRoomForNearLayer = useMediaQuery('(min-width: 1024px)');

  return (
    <section data-seamless-act className="relative h-screen overflow-hidden bg-charcoal">
      <BillboardHeroCanvas createScene={createBillboardScene} poster={POSTER} />

      {/* Vignette + floor scrim so the lockup holds against the bright lower-right of the sky. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(5,5,6,0.55)_100%)]"
      />

      {/* A soft pool behind the type itself, which the vignette above deliberately leaves clear.
          The role line is small and quiet by design and the field behind it is not a constant —
          a lit poster panel drifting through would otherwise erase it. Tightened to the lockup
          now that the sentence below is gone, so it darkens less of the field than it did. */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-[40vh] -translate-y-1/2',
          'bg-[radial-gradient(ellipse_52%_50%_at_50%_50%,rgba(6,5,7,0.55)_0%,rgba(6,5,7,0.3)_44%,transparent_76%)]',
        )}
      />

      <div className="pointer-events-none relative z-[2] flex h-full flex-col items-center justify-center px-gutter-m lg:px-gutter-d">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-start">
            {/* Tagged so the scene can measure it. The lockup is DOM, not geometry, so it cannot
                cast a shadow-map shadow on its own — the scene builds a proxy from this element's
                text, font and box so the shadow tracks the real thing across breakpoints instead
                of being positioned by hand. See `createTextShadow` in billboardScene.ts. */}
            <h1
              data-hero-lockup
              className={cn(
                'font-sans font-bold uppercase text-white',
                'text-[clamp(2.8rem,12vw,7.5rem)] leading-[0.82] tracking-display',
                '[text-shadow:0_2px_14px_rgba(0,0,0,0.55)]',
              )}
            >
              {billboardHero.name}
              <span className="accent-word" aria-hidden>
                .
              </span>
            </h1>

            {/* One row under the name, pinned to the lockup's own width: the positioning line at
                the left edge of the P, the role right-aligned under the final stop — the
                reference's placement for "advertising agency". Stacked on narrow screens, where
                the two together are wider than the name above them. */}
            <div
              className={cn(
                // No `items-start` on the stacked axis: it would size each line to its own
                // max-content, so the longer one overflows the row and gets clipped instead of
                // wrapping. Stretched, each line is bounded by the lockup's width and wraps.
                'mt-2 flex w-full flex-col gap-1 sm:mt-3',
                'sm:flex-row sm:items-baseline sm:justify-between sm:gap-6',
              )}
            >
              <p
                className={cn(
                  'font-bold uppercase text-white/85',
                  'text-[11px] tracking-[0.2em] sm:text-[13px]',
                  '[text-shadow:0_1px_10px_rgba(0,0,0,0.85)]',
                )}
              >
                {partnerParts[0]}
                {/* Sized down to the line it now sits in — at its own default it is set for a
                    body-copy subtitle and would tower over 11px type. */}
                <Hero360Mark className="text-[11px] sm:text-[13px]" />
                {partnerParts[1]}
              </p>

              <p
                className={cn(
                  'font-bold uppercase text-white/85 sm:text-right',
                  'text-[11px] tracking-[0.2em] sm:text-[13px]',
                  '[text-shadow:0_1px_10px_rgba(0,0,0,0.85)]',
                )}
              >
                {billboardHero.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Near layer, stacked over the type for depth. Two structures, each pinned to a band at
          one edge so they clip the ends of the lockup rather than covering it.

          `pointer-events-none` is not the same as inert. Without it this layer would swallow
          every pointer event and the field beneath would stop being draggable; with it, the base
          canvas receives everything and hit-tests this scene first through `overlayPointer.ts`,
          so both layers end up draggable through a single input path. Its pixel ratio is capped
          below the base canvas's — two objects do not warrant a full-resolution buffer. */}
      {hasRoomForNearLayer ? (
        <BillboardHeroCanvas
          createScene={createForegroundScene}
          transparent
          role="overlay"
          maxPixelRatio={1.5}
          className="pointer-events-none z-[3]"
        />
      ) : null}

      <ScrollCue label="Scroll to the showreel" className="z-[4]" />
    </section>
  );
}
