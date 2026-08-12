"use client";

import { useRef } from "react";
import Link from "next/link";
import { contactRequests } from "@/content/contact";
import { cn } from "@/components/ui/cn";
import { gsap } from "@/lib/motion/gsap";

/**
 * SMV contact request grid — full-viewport snap scrollport.
 * Small screens: two panels only (scrollable). Desktop 2×2: all four, one row per snap.
 */
export function ContactRequestGrid() {
  const mobileOnly = [contactRequests[0], contactRequests[3]] as const;
  const rows = [
    [contactRequests[0], contactRequests[1]],
    [contactRequests[2], contactRequests[3]],
  ] as const;

  return (
    <section
      aria-label="Ways to reach us"
      className={cn(
        "relative h-[100svh] overflow-y-auto overscroll-y-auto border-b border-white/10",
        "snap-y snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch]",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      )}
    >
      {/* < md: two panels only — project + hello. */}
      <div className="flex flex-col md:hidden">
        {mobileOnly.map((box) => (
          <div key={box.cta} className="h-[100svh] shrink-0 snap-start snap-always">
            <RequestPanel {...box} className="h-full min-h-0" />
          </div>
        ))}
      </div>

      {/* md+: full 2×2 — one snap per row. */}
      <div className="hidden md:flex md:flex-col">
        {rows.map((pair, i) => (
          <div
            key={i}
            className="grid h-[100svh] shrink-0 snap-start snap-always grid-cols-2"
          >
            {pair.map((box) => (
              <RequestPanel key={box.cta} {...box} className="h-full min-h-0" />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function RequestPanel({
  rows,
  cta,
  button,
  href,
  image,
  className,
}: (typeof contactRequests)[number] & { className?: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const external = href.startsWith("mailto:") || href.startsWith("http");

  const wiggle = () => {
    const el = btnRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap
      .timeline({ repeat: -1 })
      .to(el, { rotation: -2.2, duration: 0.04 })
      .to(el, { rotation: 2.2, duration: 0.04 });
  };
  const stop = () => {
    const el = btnRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.set(el, { rotation: 0 });
  };

  return (
    <div
      className={cn(
        "relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden border border-white/5 px-6 py-20 text-center",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />

      <div className="relative z-content flex max-w-md flex-col items-center">
        <p
          className="font-sans font-extrabold uppercase leading-[0.82] tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
        >
          {rows.map((row) => (
            <span key={row} className="block">
              {row}
            </span>
          ))}
        </p>

        <span
          aria-hidden
          className="mt-7 flex h-14 items-center justify-center text-orange motion-safe:animate-[contact-cue_1.6s_ease-in-out_infinite]"
        >
          <svg
            viewBox="0 0 24 48"
            className="h-12 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v28" />
            <path d="m5 26 7 10 7-10" />
          </svg>
        </span>

        <p
          className="mt-4 font-sans font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-orange"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
        >
          {cta}
        </p>

        <Link
          ref={btnRef}
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          onMouseEnter={wiggle}
          onMouseLeave={stop}
          className={cn(
            "mt-8 inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-white px-10 py-3.5",
            "font-sans text-[0.8rem] font-extrabold uppercase tracking-[0.16em] text-ink",
            "shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)] ring-1 ring-white/20",
            "transition-[transform,background-color,color,box-shadow] duration-300 ease-out",
            "hover-fine:hover:-translate-y-1 hover-fine:hover:bg-orange hover-fine:hover:text-ink hover-fine:hover:shadow-[0_16px_48px_-10px_rgba(245,139,39,0.55)]",
            "active:translate-y-0 active:scale-[0.97]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange",
          )}
        >
          {button}
        </Link>
      </div>
    </div>
  );
}
