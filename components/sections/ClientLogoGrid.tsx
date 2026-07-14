'use client';

import { useRef, useEffect } from 'react';
import { clientLogos } from '@/content/home';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

// Temporary placeholder logos each name morphs into on hover — mainstream, instantly
// recognizable marks so the effect is easy to read. All are monochrome WHITE SVGs (same
// colour as the name text). Cycled across the names by index. Swap to per-brand logos
// later — content already carries each brand's `logo`.
const PLACEHOLDER_LOGOS = [
  '/images/clients/placeholder-logos/nike.svg',
  '/images/clients/placeholder-logos/airbnb.svg',
  '/images/clients/placeholder-logos/spotify.svg',
  '/images/clients/placeholder-logos/adidas.svg',
  '/images/clients/placeholder-logos/netflix.svg',
  '/images/clients/placeholder-logos/figma.svg',
  '/images/clients/placeholder-logos/github.svg',
  '/images/clients/placeholder-logos/dropbox.svg',
  '/images/clients/placeholder-logos/mastercard.svg',
  '/images/clients/placeholder-logos/visa.svg',
];

// SMV's "CLIENTS:" frame, in the Propagenda brand: a giant orange wordmark bleeds behind a
// dense block of client names. Intro + wordmark + names all scrub in on enter — nothing sits
// fully painted before the scroll reveal. On hover a name CROSSFADES into its logo in place.
export function ClientLogoGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(['.clients-intro', '.clients-wordmark', '.client-name'], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set('.clients-intro', { opacity: 0, y: 28 });
      gsap.set('.clients-wordmark', { opacity: 0, scale: 0.92 });
      gsap.set('.client-name', { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // Frame arrives first — label then giant CLIENTS — then names peel in.
      tl.to(
        '.clients-intro',
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.18 },
        0,
      )
        .to(
          '.clients-wordmark',
          { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.28 },
          0.06,
        )
        .to(
          '.client-name',
          {
            opacity: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.45,
            stagger: { each: 0.04, from: 'random' },
          },
          0.2,
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-charcoal">
        <div className="absolute inset-x-0 top-24 z-content flex justify-center px-6 lg:top-28">
          <p className="clients-intro max-w-xl text-center text-sm font-medium tracking-wide text-white/70 opacity-0 md:text-base">
            Brands that trust us to shape how they show up.
          </p>
        </div>

        <h2
          aria-hidden
          className="clients-wordmark pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center whitespace-nowrap font-sans font-black uppercase leading-none tracking-tighter text-orange opacity-0"
          style={{ fontSize: 'clamp(4rem, 18vw, 18rem)' }}
        >
          Clients
        </h2>

        <div
          className="relative z-content mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-3.5 px-6 text-center font-sans font-bold uppercase tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.75)]"
          style={{ fontSize: 'clamp(0.8rem, 1.6vw, 1.55rem)' }}
        >
          {clientLogos.map((brand, i) => {
            const logo = PLACEHOLDER_LOGOS[i % PLACEHOLDER_LOGOS.length];
            const content = (
              <>
                <span className="transition-opacity duration-300 ease-out group-hover/logo:opacity-0">
                  {brand.name}
                  <span className="text-orange">.</span>
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover/logo:opacity-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt=""
                    className="h-[1.7em] w-auto max-w-[7em] shrink-0 object-contain"
                  />
                </span>
              </>
            );
            const cls = cn(
              'client-name group/logo relative inline-flex items-center whitespace-nowrap opacity-0',
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
