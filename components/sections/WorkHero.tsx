'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';
import { allCaseStudies } from '@/content/work';

/**
 * Work hub hero — an immersive, image-forward opener that replaces the generic PageHero.
 *
 * The hero IS the work: a full-bleed montage of the real case-study project images, arranged
 * as vertical strips that drift at different speeds and directions (a living wall of the
 * portfolio), tilted slightly and heavily scrimmed to charcoal so the display type stays
 * legible. The mark reacts to the cursor (mouse parallax / depth), the headline rises in on
 * load, and on scroll the content lifts + fades as a handoff into the WorkIndex below —
 * mirroring the quality bar set by the services hub hero, but as its own image-led thing.
 *
 * Reduced-motion: no drift, no parallax, no scroll handoff — the montage sits static and the
 * headline is fully visible, so the hero stays legible and complete without motion.
 */

// Every real project image used across the case studies, de-duplicated in appearance order.
// Data-driven so the wall always reflects the actual work (heroImages + gallery frames).
const projectImages = Array.from(
  new Set(
    allCaseStudies.flatMap((study) => [study.heroImage, ...study.gallery.map((g) => g.src)]),
  ),
).filter((src): src is string => Boolean(src));

// Four drifting strips — alternating direction + speed for a parallax wall. The last two
// reveal on wider screens so the wall stays full without crowding small viewports.
const COLUMNS = [
  { dir: 'up', dur: 42, show: '' },
  { dir: 'down', dur: 53, show: '' },
  { dir: 'up', dur: 36, show: 'hidden md:flex' },
  { dir: 'down', dur: 48, show: 'hidden xl:flex' },
] as const;

// Rotate the sequence per strip so no two columns march in lockstep.
function stripImages(offset: number): string[] {
  if (projectImages.length === 0) return [];
  const start = offset % projectImages.length;
  const seq = [...projectImages.slice(start), ...projectImages.slice(0, start)];
  return offset % 2 === 1 ? [...seq].reverse() : seq;
}

export function WorkHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Line-reveal on load, scroll handoff into the index, and a gentle scroll-cue bob.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.wh-line');
      if (reducedMotion) {
        gsap.set(lines, { autoAlpha: 1, yPercent: 0 });
        return;
      }
      gsap.set(lines, { autoAlpha: 0, yPercent: 60 });
      gsap.to(lines, {
        autoAlpha: 1,
        yPercent: 0,
        ease: 'power3.out',
        duration: 0.95,
        stagger: 0.12,
        delay: 0.2,
        immediateRender: false,
      });

      gsap.to('.wh-content', {
        yPercent: -24,
        autoAlpha: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });

      gsap.to('.wh-cue-dot', {
        y: 9,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Continuous vertical drift on each strip — doubled content makes 0 and -50 identical, so
  // the loop is seamless in either direction.
  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.wh-col').forEach((col) => {
        const down = col.dataset.dir === 'down';
        const dur = Number(col.dataset.dur) || 44;
        gsap.fromTo(
          col,
          { yPercent: down ? -50 : 0 },
          { yPercent: down ? 0 : -50, duration: dur, ease: 'none', repeat: -1 },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Mouse parallax on the whole wall — depth that makes the hero feel alive.
  useEffect(() => {
    if (reducedMotion) return;
    const layer = parallaxRef.current;
    if (!layer) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      layer.style.transform = `translate(${cur.x * -18}px, ${cur.y * -14}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] w-full items-end overflow-hidden bg-charcoal"
    >
      {/* Full-bleed montage of the real work — the hero IS the portfolio. */}
      <div ref={parallaxRef} aria-hidden className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 flex origin-center scale-[1.16] -rotate-[5deg] gap-2 brightness-[0.82] sm:gap-3">
          {COLUMNS.map((column, colIndex) => (
            <div key={colIndex} className={cn('relative flex-1 overflow-hidden', column.show)}>
              <div
                className="wh-col flex flex-col will-change-transform"
                data-dir={column.dir}
                data-dur={column.dur}
              >
                {[...stripImages(colIndex * 2), ...stripImages(colIndex * 2)].map((src, i) => (
                  <div key={i} className="relative aspect-[4/5] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charcoal scrim — unify the wall, darken the bottom-left where the type lives, and
          vignette the edges so nothing competes with the headline. */}
      <div aria-hidden className="absolute inset-0 bg-charcoal/45" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal/85 to-charcoal/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-charcoal/75 via-transparent to-charcoal/60"
      />
      <div
        aria-hidden
        className="absolute inset-0 [background:radial-gradient(120%_110%_at_20%_85%,transparent_35%,rgba(37,37,37,0.75)_100%)]"
      />

      {/* Content — anchored bottom-left, asymmetric, with the work reading behind it. */}
      <div className="wh-content relative z-content w-full px-gutter-m pb-[13vh] pt-40 lg:px-gutter-d">
        <div className="max-w-2xl">
          <h1
            className="wh-line font-sans font-bold uppercase leading-[0.9] tracking-display text-white [text-shadow:0_2px_34px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)' }}
          >
            <span className="block">Selected</span>
            <span className="block text-orange">work.</span>
          </h1>
          <p className="wh-line mt-8 max-w-md text-base leading-relaxed text-white/75 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] md:text-lg">
            A selection of the brands we&rsquo;ve built, refined, and launched &mdash; identity to
            interface.
          </p>
        </div>
      </div>

      {/* Subtle scroll cue — a hairline with a drifting dot, no arrow decoration. */}
      <div className="wh-line pointer-events-none absolute inset-x-0 bottom-7 z-content hidden items-center justify-center gap-3 md:flex">
        <span className="text-backstage text-white/55">Scroll</span>
        <span className="relative h-9 w-px overflow-hidden bg-white/25">
          <span className="wh-cue-dot absolute inset-x-0 top-0 h-3 -translate-y-3 bg-orange" />
        </span>
      </div>
    </section>
  );
}
