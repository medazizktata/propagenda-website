'use client';

import { useEffect, useRef } from 'react';
import { HoverPlayVideo } from '@/components/molecules/HoverPlayVideo';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import type { VideoProject } from '@/types/content';

// Signature moment: the landscape showreel wedged between two lines of display type, so the
// headline and the film physically interlock. Poster-first (the hero already autoplays this cut);
// hover previews, click plays it full-screen with sound.
export function VideoFeaturedFilm({
  film,
  onOpen,
}: {
  film: VideoProject;
  onOpen: (project: VideoProject) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    registerGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.ff-reveal', { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.utils.toArray<HTMLElement>('.ff-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          },
        );
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  const headingClass =
    'ff-line relative z-20 pointer-events-none text-center font-sans font-bold uppercase leading-[0.86] tracking-display text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]';
  const headingStyle = { fontSize: 'clamp(2.4rem, 9vw, 7rem)' } as const;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-charcoal px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="ff-reveal mb-8 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-orange">
          <span aria-hidden className="h-[3px] w-9 rounded-full bg-orange" />
          Featured film
        </p>

        {/* The interlock — negative margins resolve against the huge heading size. */}
        <div className="ff-reveal">
          <h2 className={`${headingClass} -mb-[0.2em]`} style={headingStyle}>
            Made to
          </h2>
          <div className="relative z-10 mx-auto w-full max-w-4xl">
            <HoverPlayVideo
              project={film}
              rounded="rounded-2xl"
              hideMeta
              onOpen={() => onOpen(film)}
            />
          </div>
          <h2 className={`${headingClass} -mt-[0.28em]`} style={headingStyle}>
            Be watched<span className="text-orange">.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
