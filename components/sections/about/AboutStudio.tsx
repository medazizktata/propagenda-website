"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { aboutContent } from "@/content/about";
import { AboutServices } from "@/components/sections/about/AboutServices";
import { AboutTestimonials } from "@/components/sections/about/AboutTestimonials";
import { cn } from "@/components/ui/cn";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * Plusdrie editorial body — sits under the immersive statement journey.
 * Intro + principles, services rows, team, soft closer.
 */
export function AboutStudio() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(0);
  const { intro, principles, team, closer } = aboutContent;

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
      <div className="px-gutter-m py-24 lg:px-gutter-d lg:py-32">
        <div className="mx-auto grid max-w-[1920px] items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div data-about-reveal>
            <p className="mb-6 text-sm font-medium text-white/45">{intro.label}</p>
            <h2
              className="max-w-lg font-sans font-bold leading-[1.14] tracking-[-0.025em] text-white"
              style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.85rem)" }}
            >
              {intro.statement}
            </h2>
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-base text-white/50"
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

      {/* Team */}
      <div className="px-gutter-m py-24 lg:px-gutter-d lg:py-32">
        <div className="mx-auto grid max-w-[1920px] gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
          <div data-about-reveal>
            <p className="mb-5 text-sm font-medium text-white/45">{team.label}</p>
            <h3
              className="max-w-md font-sans font-bold leading-[1.14] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.35rem)" }}
            >
              {team.statement}
            </h3>

            <ul className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {team.members.map((m) => (
                <li key={m.name} className="min-w-0">
                  <p className="font-sans text-base font-semibold text-white md:text-lg">
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-sm text-white/45">{m.role}</p>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-about-reveal
            className="relative aspect-[4/3] overflow-hidden lg:sticky lg:top-28 lg:aspect-[5/4]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={team.image}
              alt={team.imageAlt}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/35 to-transparent" />
          </div>
        </div>
      </div>

      {/* Closer */}
      <div className="relative px-gutter-m py-28 text-center lg:px-gutter-d lg:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange opacity-[0.08] blur-[140px]"
        />
        <div data-about-reveal className="relative z-content mx-auto max-w-3xl">
          <h2
            className="font-sans font-bold leading-[1.08] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            <span className="block text-white">{closer.line1}</span>
            <span className="block text-orange">{closer.line2}</span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-base leading-relaxed text-white/55">
            {closer.support}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`mailto:${closer.email}`}
              className={cn(
                "inline-flex min-h-12 items-center gap-2 rounded-full bg-orange px-8 py-3.5",
                "font-sans text-sm font-bold text-black",
                "transition-[transform,background-color] duration-300 ease-out",
                "hover-fine:hover:-translate-y-0.5 hover-fine:hover:bg-white",
              )}
            >
              <span aria-hidden>↗</span>
              {closer.email}
            </Link>
            <Link
              href="/contact"
              className={cn(
                "inline-flex min-h-12 items-center rounded-full border border-white/20 px-8 py-3.5",
                "font-sans text-sm font-bold uppercase tracking-[0.12em] text-white",
                "transition-[transform,border-color,color] duration-300 ease-out",
                "hover-fine:hover:-translate-y-0.5 hover-fine:hover:border-orange hover-fine:hover:text-orange",
              )}
            >
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
