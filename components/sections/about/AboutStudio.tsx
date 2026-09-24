"use client";

import { useEffect, useRef } from "react";
import { aboutContent } from "@/content/about";
import { AboutServices } from "@/components/sections/about/AboutServices";
import { AboutTestimonials } from "@/components/sections/about/AboutTestimonials";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * Plusdrie editorial body — sits under the immersive statement journey.
 * Intro statement, services rows, testimonials. Closer lives on AboutPageContent.
 */
export function AboutStudio() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { intro } = aboutContent;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-about-reveal]").forEach((item) => {
        gsap.from(item, {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about-studio"
      ref={rootRef}
      className="relative scroll-mt-24 bg-charcoal text-white"
    >
      {/* Intro — the statement alone. The corner-bracket "viewfinder" frame and the principles
          accordion beside it were removed (explicit user direction, 2026-09-24: "remove that outer
          box, and remove the right side ... adjust layout for displaying main text only"), so the
          line gets the full measure and a larger size. The warm ambient glow stays. */}
      <div className="relative px-gutter-m py-28 lg:px-gutter-d lg:py-40">
        <div aria-hidden className="pointer-events-none absolute left-[8%] top-1/2 h-[70%] w-[55%] -translate-y-1/2 rounded-full bg-orange/10 blur-[110px]" />
        <div data-about-reveal className="relative z-content mx-auto max-w-[1920px]">
          <p className="mb-8 text-sm font-medium text-white/45">{intro.label}</p>
          <h2
            className="max-w-[18ch] text-balance font-sans font-bold leading-[1.06] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.25rem, 5.6vw, 5.25rem)" }}
          >
            {intro.statement}
          </h2>
        </div>
      </div>

      <AboutServices />

      <AboutTestimonials />
    </section>
  );
}
