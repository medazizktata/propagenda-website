'use client';

import { useRef, useEffect } from 'react';
import { clientLogos } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

// Sticky clients frame. Scroll stages: intro → CLIENTS → brand names (random order).
// Reveal spans most of a short pin so contact follows soon after the last name lands.
export function ClientLogoGrid() {
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

      tl.to(
        '.clients-intro',
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.14 },
        0,
      )
        .to(
          '.clients-wordmark',
          { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.16 },
          0.1,
        )
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
        <div className="absolute inset-x-0 top-24 z-content flex justify-center px-6 lg:top-28">
          <p className="clients-intro max-w-xl text-center text-sm font-medium tracking-wide text-white/70 md:text-base">
            Brands that trust us to shape how they show up.
          </p>
        </div>

        <h2 className="sr-only">Clients</h2>
        <div
          aria-hidden
          className="clients-wordmark pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-tighter text-white/10"
          style={{ fontSize: 'clamp(4rem, 18vw, 18rem)' }}
        >
          Clients
        </div>

        <div
          className="relative z-content mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-3 px-6 text-center font-sans font-bold uppercase tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.75)]"
          style={{ fontSize: 'clamp(0.7rem, 1.25vw, 1.15rem)' }}
        >
          {clientLogos.map((brand) => {
            // Real extracted client logo (content/home.ts); names without one don't morph.
            const logo = brand.logo ? `/images/clients/${brand.logo}` : null;
            const content = (
              <>
                <span
                  className={cn(
                    'transition-opacity duration-300 ease-out',
                    logo && 'group-hover/logo:opacity-0',
                  )}
                >
                  {brand.name}
                  <span className="text-orange">.</span>
                </span>
                {logo ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover/logo:opacity-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt=""
                      className="h-[1.7em] w-auto max-w-[7em] shrink-0 object-contain brightness-0 invert"
                    />
                  </span>
                ) : null}
              </>
            );
            const cls = cn(
              'client-name group/logo relative inline-flex items-center whitespace-nowrap',
              brand.url && 'cursor-pointer',
            );
            return brand.url ? (
              <a key={brand.name} href={brand.url} target="_blank" rel="noopener noreferrer" className={cls}>
                {content}
              </a>
            ) : (
              <span key={brand.name} className={cls}>
                {content}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
