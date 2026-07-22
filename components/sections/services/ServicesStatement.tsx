'use client';

import { useEffect, useRef } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * Act 1 of the Services page — an immersive full-bleed brand-monogram hero. The mark reacts
 * to the cursor (mouse parallax / depth), the statement rises in on load, and on scroll the
 * text lifts + fades as a handoff into the index. Draft copy — refine voice before ship.
 */
export function ServicesStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  // Line reveal on load + scroll handoff (text lifts + fades into the index).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.svc-stmt-line');
      if (reducedMotion) {
        gsap.set(lines, { autoAlpha: 1, yPercent: 0 });
        return;
      }
      gsap.set(lines, { autoAlpha: 0, yPercent: 45 });
      gsap.to(lines, {
        autoAlpha: 1,
        yPercent: 0,
        ease: 'power3.out',
        duration: 0.9,
        stagger: 0.12,
        delay: 0.15,
        immediateRender: false,
      });

      gsap.to('.svc-hero-content', {
        yPercent: -28,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Mouse parallax on the mark — depth that makes the hero feel alive.
  useEffect(() => {
    if (reducedMotion) return;
    const img = imgRef.current;
    if (!img) return;
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
      img.style.transform = `scale(1.14) translate(${cur.x * -24}px, ${cur.y * -16}px)`;
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
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal"
    >
      {/* Full-bleed brand monogram — the hero IS the mark. */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/images/brand/monogram-glow.jpg"
          alt=""
          className="h-full w-full object-cover object-[68%_center] will-change-transform lg:object-center"
          style={{ transform: 'scale(1.14)' }}
        />
        {/* Fade the mark into charcoal on the left (under the text) + along the floor. */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/10 md:via-charcoal/55 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />
        {/* Radial vignette focuses the glow. */}
        <div className="absolute inset-0 [background:radial-gradient(130%_120%_at_68%_45%,transparent_38%,rgba(15,21,31,0.6)_100%)]" />
      </div>

      <div className="svc-hero-content relative z-content w-full px-gutter-m lg:px-gutter-d">
        <div className="max-w-2xl translate-y-[7vh]">
          <SectionLabel className="svc-stmt-line mb-6">Services</SectionLabel>
          <h1
            className="font-sans font-bold uppercase leading-[0.92] tracking-display text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]"
            style={{ fontSize: 'clamp(2.6rem, 8vw, 7rem)' }}
          >
            <span className="svc-stmt-line block">The whole brand,</span>
            <span className="svc-stmt-line block text-orange">one studio.</span>
          </h1>
          <p className="svc-stmt-line mt-8 max-w-md text-base leading-relaxed text-white/75 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] md:text-lg">
            Eight integrated capabilities &mdash; from the first logo to the full launch, and
            everything that carries your brand in between.
          </p>
        </div>
      </div>
    </section>
  );
}
