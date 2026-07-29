"use client";

import { useEffect, useRef } from "react";
import { contactInvite } from "@/content/contact";
import { cn } from "@/components/ui/cn";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

function HandwrittenEmail({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="group inline-flex flex-col items-center normal-case text-orange transition-colors hover-fine:hover:text-white"
    >
      <span className="font-sans text-xl font-semibold tracking-normal md:text-2xl lg:text-[1.75rem]">
        {email}
      </span>
      {/* Marker-style scribble — uneven pressure, slight overshoot, not a flat CSS underline */}
      <svg
        aria-hidden
        viewBox="0 0 300 22"
        className="mt-1 h-[0.85em] w-[min(100%,24rem)] overflow-visible text-orange"
      >
        <path
          d="M6 13.5c18.4-5.2 36.8 1.6 55.2-2.4 17.6-3.8 34.4-8.2 52.8-3.6 16.8 4.2 32.4 6.8 49.6 1.2 14.8-4.8 29.6-7.2 45.2-2.8 13.6 3.8 28.4 5.6 43.6-0.4 10.4-4.1 21.6-6.8 35.6-3.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M12 16.8c22.4 2.4 44.8-4.8 67.2-1.2 20.8 3.4 41.6 5.6 62.4 0.8 18.4-4.2 37.6-3.6 56 1.6 14.4 4.1 30.4 2.8 46.4-1.2 11.2-2.8 23.2-1.6 36.8 2.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
        {/* Tiny end flick — pen leaving the page */}
        <path
          d="M278 15.2c6.4-1.6 10.8-4.8 14.4-8.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </a>
  );
}

/** SMV contact — invite headline + hand-underlined email (not shouty caps). */
export function ContactInvite() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-invite-fade]", {
        y: 28,
        autoAlpha: 0,
        ease: "power3.out",
        duration: 0.65,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      className="relative border-b border-white/10 bg-charcoal px-gutter-m py-20 lg:px-gutter-d lg:py-28"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p
          data-invite-fade
          className="font-sans font-extrabold uppercase leading-[0.92] tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.65rem, 3.8vw, 3rem)" }}
        >
          {contactInvite.lines.map((line, i) => (
            <span key={i} className={cn(line.accent ? "text-orange" : "text-white")}>
              {line.text}
            </span>
          ))}
        </p>

        <p
          data-invite-fade
          className="mx-auto mt-8 max-w-2xl text-base font-medium leading-relaxed text-white/70 md:text-lg"
        >
          {contactInvite.subline}
        </p>

        <div data-invite-fade className="mt-10">
          <HandwrittenEmail email={contactInvite.mailto} />
        </div>
      </div>
    </section>
  );
}
