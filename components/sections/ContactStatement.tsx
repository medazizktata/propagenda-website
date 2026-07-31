"use client";

import { contactBridge } from "@/content/contact";
import { cn } from "@/components/ui/cn";

/** Thin kinetic ribbon — black field, orange punches (Humbleteam restraint). */
export function ContactStatement() {
  const items = Array.from({ length: 5 }).flatMap(() => contactBridge);

  return (
    <section
      aria-label={contactBridge.join(". ")}
      className="relative overflow-hidden border-b border-white/10 bg-black py-4 lg:py-5"
    >
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
        <div className="flex w-max animate-[marquee_26s_linear_infinite] motion-reduce:animate-none">
          {items.map((word, i) => (
            <span key={`${word}-${i}`} className="flex shrink-0 items-center">
              <span
                className={cn(
                  "whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-[-0.02em]",
                  i % 3 === 1 ? "text-orange" : "text-white",
                )}
                style={{ fontSize: "clamp(1.15rem, 3.2vw, 2.1rem)" }}
              >
                {word}
              </span>
              <span
                aria-hidden
                className="mx-[0.45em] text-orange/50"
                style={{ fontSize: "clamp(1.15rem, 3.2vw, 2.1rem)" }}
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
