'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { clients } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { isPageUnlocked } from '@/lib/featureFlags';

// Sticky clients frame. Scroll stages: intro → CLIENTS → brand names (random order).
// Reveal spans most of a short pin so contact follows soon after the last name lands.
// Restored 2026-09-24 as names only (it was removed from the home page on 2026-09-18 as
// ClientLogoGrid): the hover swap from a name to its logo is switched off (explicit user
// direction: "remove the hover to reveal logo behavior... disable it"). A name with a published
// case study links to it (explicit user direction, 2026-09-24: "add click behavior to go to
// dedicated page of the client work"); otherwise to the brand's own site where we have one.
const LINK_CLASS =
  'rounded-sm transition-colors duration-200 hover-fine:hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal';
export function ClientList() {
  const workUnlocked = isPageUnlocked('work');
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(['.clients-intro', '.clients-wordmark', '.client-name'], {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      const names = gsap.utils.toArray<HTMLElement>('.client-name');

      gsap.set('.clients-intro', { autoAlpha: 0, y: 20 });
      gsap.set('.clients-wordmark', { autoAlpha: 0, scale: 0.94 });
      gsap.set(names, { autoAlpha: 0, y: 10 });

      // Compact pin — finish names before the section ends so contact arrives sooner.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: 'bottom bottom',
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      tl.to('.clients-intro', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.14 }, 0)
        .to('.clients-wordmark', { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.16 }, 0.1)
        .to(
          names,
          {
            autoAlpha: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.1,
            stagger: { each: 0.022, from: 'random' },
          },
          0.24,
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-[120vh] bg-charcoal md:h-[125vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-charcoal">
        <h2 className="sr-only">Clients</h2>
        <div
          aria-hidden
          className="clients-wordmark pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-tighter text-white/[0.18]"
          style={{ fontSize: 'clamp(4rem, 18vw, 18rem)' }}
        >
          Clients
        </div>

        <div className="relative z-content mx-auto flex max-w-6xl flex-col items-center px-5 sm:px-6">
          <p className="clients-intro mb-5 max-w-xl text-center text-sm font-medium tracking-wide text-white/70 md:mb-6 md:text-base">
            Brands that trust us to shape how they show up.
          </p>
          {/* Phones get a smaller size and tighter gaps: at the sm+ size the 37 names wrap to
              ~20 lines on a 390px screen — taller than this pinned full-screen frame, so the
              first and last names were clipped off it. sm and up are unchanged. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center font-sans text-[0.9rem] font-bold uppercase leading-snug tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.75)] sm:gap-x-5 sm:gap-y-4 sm:text-[clamp(1.05rem,0.7rem+2.4vw,1.25rem)] sm:leading-normal md:gap-x-6">
            {clients.map((brand) => {
              const label = (
                <>
                  {brand.name}
                  <span className="text-orange">.</span>
                </>
              );
              return (
                <li key={brand.name} className="client-name whitespace-nowrap">
                  {brand.slug && workUnlocked ? (
                    <Link href={`/work/${brand.slug}`} className={LINK_CLASS}>
                      {label}
                    </Link>
                  ) : brand.url ? (
                    <a href={brand.url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                      {label}
                    </a>
                  ) : (
                    label
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
