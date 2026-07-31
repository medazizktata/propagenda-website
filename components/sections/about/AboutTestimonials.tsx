"use client";

import { aboutContent } from "@/content/about";
import { cn } from "@/components/ui/cn";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

const accentClass = {
  orange: "text-orange",
  white: "text-white/80",
  muted: "text-white/35",
} as const;

/**
 * Plusdrie-style horizontal testimonial strip — auto-scrolls, no scrollbar.
 */
export function AboutTestimonials() {
  const { testimonials } = aboutContent;
  const reducedMotion = useReducedMotion();
  // Duplicate for seamless CSS marquee loop (-50% translate).
  const loop = [...testimonials.items, ...testimonials.items];

  return (
    <div className="py-20 lg:py-28">
      <div className="px-gutter-m lg:px-gutter-d">
        <p data-about-reveal className="mb-10 text-sm font-medium text-white/45 md:mb-14">
          {testimonials.label}
        </p>
      </div>

      <div
        data-about-reveal
        className={cn(
          "overflow-hidden",
          reducedMotion &&
            "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        <div
          className={cn(
            "flex w-max gap-4 lg:gap-5",
            !reducedMotion &&
              "animate-[marquee_48s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none",
          )}
        >
          {loop.map((item, i) => {
            const featured = Boolean(item.featured);
            return (
              <article
                key={`${item.name}-${i}`}
                aria-hidden={i >= testimonials.items.length}
                className={cn(
                  "relative flex w-[min(85vw,22rem)] shrink-0 flex-col overflow-hidden rounded-[1.75rem] p-7 sm:w-[24rem] sm:p-8",
                  featured
                    ? "bg-orange text-black"
                    : "bg-[#2a2a2a] text-white ring-1 ring-white/8",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "font-serif text-5xl leading-none",
                    featured
                      ? "text-black/35"
                      : accentClass[(item.accent ?? "orange") as keyof typeof accentClass],
                  )}
                >
                  “
                </span>

                <p
                  className={cn(
                    "mt-3 flex-1 text-[0.95rem] leading-relaxed sm:text-base",
                    featured ? "text-black/90" : "text-white/80",
                  )}
                >
                  {item.quote}
                </p>

                <div className="mt-10 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "font-sans text-sm font-semibold",
                        featured ? "text-black" : "text-white",
                      )}
                    >
                      {item.name}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs leading-snug",
                        featured ? "text-black/55" : "text-white/40",
                      )}
                    >
                      {item.role}
                    </p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logo}
                    alt=""
                    className={cn(
                      "h-8 w-auto max-w-[5.5rem] object-contain opacity-80",
                      featured ? "brightness-0" : "brightness-0 invert",
                    )}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
