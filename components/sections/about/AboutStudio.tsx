"use client";

import { useEffect, useRef, useState } from "react";
import { aboutContent } from "@/content/about";
import { AboutServices } from "@/components/sections/about/AboutServices";
import { AboutTestimonials } from "@/components/sections/about/AboutTestimonials";
import { cn } from "@/components/ui/cn";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * Plusdrie editorial body — sits under the immersive statement journey.
 * Intro + principles, services rows, team. Closer lives on AboutPageContent.
 */
export function AboutStudio() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(0);
  const { intro, principles } = aboutContent;

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
      {/* Intro + principles */}
      <div className="relative px-gutter-m py-24 lg:px-gutter-d lg:py-32">
        <div className="mx-auto grid max-w-[1920px] items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div data-about-reveal className="relative">
            {/* Registration-mark motif, not a logo watermark: a viewfinder frame around
                the whole intro block with a single orange registration pip at its
                corner, the print/production mark of a studio putting a brand into
                alignment. Ambient glow behind it for warmth. Deliberately not the
                monogram — see backlog TASK-10 for why the old wallpaper is gone. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[6%] -top-[6%] hidden h-[112%] w-[108%] select-none md:block"
            >
              <div className="absolute -inset-10 rounded-full bg-orange/10 blur-[90px]" />
              <svg viewBox="0 0 200 200" fill="none" preserveAspectRatio="none" className="relative h-full w-full">
                <path d="M2 46V2H46" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <path d="M154 2H198V46" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <path d="M198 154V198H154" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <path d="M46 198H2V154" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <path d="M2 2h16M2 2v16" stroke="#F58B27" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <circle cx="2" cy="2" r="3" fill="#F58B27" />
              </svg>
            </div>
            <div className="relative z-content">
              <p className="mb-6 text-sm font-medium text-white/45">{intro.label}</p>
              <h2
                className="max-w-lg font-sans font-bold leading-[1.14] tracking-[-0.025em] text-white"
                style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.85rem)" }}
              >
                {intro.statement}
              </h2>
            </div>
          </div>

          <ul data-about-reveal className="divide-y divide-white/10">
            {principles.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        "font-sans text-lg font-semibold tracking-tight transition-colors md:text-xl",
                        isOpen ? "text-orange" : "text-white",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-base font-medium text-white/50"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-lg pb-6 text-base leading-relaxed text-white/60">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <AboutServices />

      <AboutTestimonials />
    </section>
  );
}
