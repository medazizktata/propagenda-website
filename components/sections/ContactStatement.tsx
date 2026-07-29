"use client";

import { contactBridge } from "@/content/contact";
import { cn } from "@/components/ui/cn";

/** Full-bleed kinetic strip — replaces the weak disclaimer. */
export function ContactStatement() {
  const items = Array.from({ length: 4 }).flatMap(() => contactBridge);

  return (
    <section
      aria-label={contactBridge.join(". ")}
      className="relative overflow-hidden border-b border-white/10 bg-orange py-5 lg:py-6"
    >
      <div className="flex overflow-hidden">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] motion-reduce:animate-none">
          {items.map((word, i) => (
            <span key={`${word}-${i}`} className="flex shrink-0 items-center">
              <span
                className={cn(
                  "whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-[-0.02em] text-black",
                )}
                style={{ fontSize: "clamp(1.5rem, 4.5vw, 3rem)" }}
              >
                {word}
              </span>
              <span
                aria-hidden
                className="mx-[0.4em] text-black/35"
                style={{ fontSize: "clamp(1.5rem, 4.5vw, 3rem)" }}
              >
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
