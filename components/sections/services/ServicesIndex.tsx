'use client';

import { useEffect, useRef, useState } from 'react';
import { serviceHubCards } from '@/content/servicesHub';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ServiceRow } from './ServiceRow';

/**
 * The Services page core act, in the Propagenda brand: a dark centre panel flanked by two
 * orange rails (BRAND.md mandate), a giant ghost "SERVICES" behind, and the eight services
 * as huge type rows. Hover/focus a row → its real work blooms full-bleed behind the names
 * (fast fade layered over a slow 5s zoom, SMV projectoverview), siblings dim, arrow + caption
 * appear. Rows assemble across the pin (keyed to the lock so they're never pre-composed).
 */
export function ServicesIndex() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.services-row-wrap');

      if (reducedMotion) {
        gsap.set(['.services-rail', '.services-ghost', '.services-kicker', ...rows], {
          autoAlpha: 1,
          scaleY: 1,
          y: 0,
        });
        return;
      }

      gsap.set('.services-rail', { scaleY: 0, transformOrigin: '50% 50%' });
      gsap.set(['.services-ghost', '.services-kicker'], { autoAlpha: 0, y: 20 });
      gsap.set(rows, { autoAlpha: 0, y: 16 });

      // Keyed to the lock (frame is centre-of-viewport, so it only enters view as the section
      // pins) — assembles on-screen, then holds. Ends inside the pin so contact follows.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 8%',
          end: '32% top',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to('.services-rail', { scaleY: 1, ease: 'power2.out', duration: 0.4 }, 0)
        .to('.services-kicker', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.25 }, 0.05)
        .to('.services-ghost', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.1)
        .to(rows, { autoAlpha: 1, y: 0, ease: 'power1.out', duration: 0.3, stagger: 0.07 }, 0.22);
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const activeCard = active != null ? serviceHubCards[active] : null;

  return (
    <section ref={sectionRef} className="relative h-[170vh] bg-charcoal md:h-[185vh]">
      {/* Full-bleed on purpose: rails + preview reach the viewport edges (no gutter). */}
      <div
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-charcoal"
        style={{ ['--rail' as keyof React.CSSProperties]: 'clamp(1.75rem, 4.5vw, 4.5rem)' }}
        onMouseLeave={() => setActive(null)}
      >
          {/* Full-bleed preview panel, spanning edge-to-edge between the rails. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 overflow-hidden"
            style={{ left: 'var(--rail)', right: 'var(--rail)' }}
          >
            {serviceHubCards.map((card, i) =>
              card.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={card.slug}
                  src={card.preview}
                  alt=""
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover will-change-transform',
                    active === i ? 'opacity-100' : 'opacity-0',
                  )}
                  style={{
                    transitionProperty: 'opacity, transform',
                    transitionDuration: reducedMotion ? '200ms, 0ms' : '450ms, 5000ms',
                    transitionTimingFunction: 'cubic-bezier(0.215,0.61,0.355,1), ease-out',
                    transform: reducedMotion
                      ? 'scale(1.02)'
                      : active === i
                        ? 'scale(1.16)'
                        : 'scale(1.04)',
                  }}
                />
              ) : null,
            )}
            {/* Fallback brand panel when the active card has no image. */}
            {activeCard && !activeCard.preview && (
              <BrandPattern variant="dense" className="opacity-30" />
            )}
            {/* Scrim — darker on the left (under the names) so they stay legible while the
                work still reads on the right; extra floor at the bottom for the caption. */}
            <div className="absolute inset-0 bg-charcoal/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
          </div>

          {/* Orange rails flanking the panel. */}
          <div
            aria-hidden
            className="services-rail pointer-events-none absolute inset-y-0 left-0 bg-orange"
            style={{ width: 'var(--rail)' }}
          />
          <div
            aria-hidden
            className="services-rail pointer-events-none absolute inset-y-0 right-0 bg-orange"
            style={{ width: 'var(--rail)' }}
          />

          {/* Ghost SERVICES behind the rows. */}
          <h2
            aria-hidden
            className="services-ghost pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center whitespace-nowrap font-sans font-black uppercase leading-[0.8] tracking-tighter text-white/[0.06]"
            style={{ fontSize: 'clamp(3rem, 15vw, 15rem)' }}
          >
            Services
          </h2>

          {/* Rows + caption — centred column over the full-bleed panel. */}
          <div
            className="relative z-content mx-auto flex h-full w-full max-w-7xl flex-col justify-center pb-12 pt-20 md:pt-24"
            style={{
              paddingLeft: 'calc(var(--rail) + clamp(1rem, 3vw, 3rem))',
              paddingRight: 'calc(var(--rail) + clamp(1rem, 3vw, 3rem))',
            }}
          >
            <SectionLabel className="services-kicker mb-4 md:mb-6">
              Services &mdash; 08 capabilities
            </SectionLabel>

            <ul className="flex flex-col">
              {serviceHubCards.map((card, i) => (
                <li key={card.slug} className="services-row-wrap">
                  <ServiceRow
                    card={card}
                    index={i}
                    isActive={active === i}
                    isDimmed={active != null && active !== i}
                    onActivate={setActive}
                  />
                </li>
              ))}
            </ul>

            {/* Caption — active service's descriptor; fixed height so nothing reflows. */}
            <div className="mt-5 h-5 md:mt-7">
              <p
                className={cn(
                  'text-xs font-medium uppercase tracking-wider text-white/70 transition-opacity duration-300 md:text-sm',
                  activeCard ? 'opacity-100' : 'opacity-0',
                )}
              >
                {activeCard?.descriptor ?? ''}
              </p>
            </div>
          </div>
      </div>
    </section>
  );
}
