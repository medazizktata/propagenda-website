"use client";

import { memo, useEffect, useRef } from "react";
import { aboutContent } from "@/content/about";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

const fmt = (v: number, decimals: number) => v.toFixed(decimals);

/* Reduced-motion check that also reads the media query directly — so the count-up
   NEVER parks the numbers at 0 on the first render, when the hook still reports false. */
function prefersReducedMotion(reduced: boolean) {
  return (
    reduced ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

/**
 * Impact stats band — proof figures between the testimonials and the closing CTA.
 *
 * Legible / a11y by default: each stat's TRUE final value is rendered in the DOM (so
 * SSR + no-JS show the real number) and repeated in an sr-only "<value><suffix> <label>"
 * for screen readers, while the ticking visual is aria-hidden. Under motion the numbers
 * count up ONCE as the band scrolls into view — one orchestrated reveal (cells fade up +
 * numbers count). Under reduced motion nothing animates; the final values render static.
 *
 * Design (docs/rework/06): charcoal ground, no wallpaper, one protagonist (the numbers).
 * Poppins 800 numbers on a token display size, IBM Plex Mono labels (backstage register),
 * orange used only as the unit punctuation (+, ×, M+). No CTA here — the orange CTA follows.
 *
 * memo'd so the parent's `launched` state changes never re-render this band (which would
 * otherwise reset the imperatively-driven number text mid-count).
 */
export const AboutStats = memo(function AboutStats() {
  const { stats } = aboutContent;
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion(reducedMotion)) return; // reduced motion → static values
    registerGsap();

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>("[data-count]", root);
      const cells = gsap.utils.toArray<HTMLElement>("[data-stat]", root);

      // Park the offscreen state before the band scrolls into view (it sits far below
      // the fold, so this is never visible). No-JS / reduced motion never run this.
      nums.forEach((el) => {
        el.textContent = fmt(0, Number(el.dataset.decimals));
      });
      gsap.set(cells, { autoAlpha: 0, y: 18 });

      ScrollTrigger.create({
        trigger: root,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(cells, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          });
          nums.forEach((el, i) => {
            const target = Number(el.dataset.count);
            const decimals = Number(el.dataset.decimals);
            const proxy = { v: 0 };
            gsap.to(proxy, {
              v: target,
              duration: 1.4,
              ease: "power2.out",
              delay: i * 0.08,
              onUpdate: () => {
                el.textContent = fmt(proxy.v, decimals);
              },
              onComplete: () => {
                el.textContent = fmt(target, decimals); // land exactly on the true value
              },
            });
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      aria-label="Propagenda by the numbers"
      className="bg-charcoal py-24 lg:py-32"
    >
      <div className="px-gutter-m lg:px-gutter-d">
        <div className="mx-auto max-w-[1920px]">
          <p className="mb-12 flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-label text-white/45 md:mb-16">
            <span aria-hidden className="inline-block h-px w-8 bg-orange/70" />
            {stats.eyebrow}
          </p>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4 lg:gap-x-12">
            {stats.items.map((s) => (
              <li key={s.label} data-stat className="flex flex-col gap-3">
                <span className="sr-only">
                  {fmt(s.value, s.decimals)}
                  {s.suffix} {s.label}
                </span>

                <span
                  aria-hidden
                  className="text-display-xs font-sans font-extrabold tracking-[-0.015em] text-white tabular-nums"
                >
                  <span data-count={s.value} data-decimals={s.decimals}>
                    {fmt(s.value, s.decimals)}
                  </span>
                  <span className="text-orange">{s.suffix}</span>
                </span>

                <span
                  aria-hidden
                  className="font-mono text-xs font-medium uppercase tracking-label text-white/50 sm:text-sm"
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});
