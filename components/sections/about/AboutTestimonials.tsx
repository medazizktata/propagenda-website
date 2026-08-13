"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { aboutContent } from "@/content/about";
import { cn } from "@/components/ui/cn";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

const accentClass = {
  orange: "text-orange",
  white: "text-white/80",
  muted: "text-white/35",
} as const;

/* Idle auto-scroll cadence (px/s, leftward). Drag yields to the pointer 1:1; on
   release a manual inertia tween decays the flick velocity back to this cadence. */
const AUTO_V = -46;
/* Inertia: velocity approaches the auto cadence with this time constant (s). */
const DECAY_TAU = 0.55;
/* Clamp a wild flick so momentum stays tasteful. */
const MAX_FLICK = 2600;

/* Hydration-safe client flag — false on SSR + first hydration (so no-JS renders a
   plain, manually scrollable strip), true thereafter (JS takes over drag + auto). */
const noopSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * Horizontal testimonial strip. Idle: a seamless infinite auto-scroll (JS, constant
 * cadence). Drag: pointer/touch grabs the track and moves it 1:1; on release a manual
 * momentum tween (NO paid InertiaPlugin) glides on and decays velocity-continuously
 * back into the auto-scroll. Plain hover never pauses it. Cards lift on hover.
 */
export function AboutTestimonials() {
  const { testimonials } = aboutContent;
  const reducedMotion = useReducedMotion();
  const isClient = useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);
  // Duplicate for the seamless loop; the wrap distance is the 2nd copy's offset.
  const loop = [...testimonials.items, ...testimonials.items];

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!isClient) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const auto = reducedMotion ? 0 : AUTO_V;
    // Exact seamless shift = the 2nd copy's first card offset (cards + gaps), so the
    // loop point never hitches (scrollWidth/2 would be off by half a gap).
    const measure = () => {
      const el = track.children[testimonials.items.length] as HTMLElement | undefined;
      return el && el.offsetLeft > 0 ? el.offsetLeft : track.scrollWidth / 2;
    };
    let half = measure();
    let x = 0;
    let v = auto;
    let mode: "auto" | "drag" | "inertia" = "auto";
    let last = performance.now();
    let raf = 0;

    const wrap = (val: number) => {
      if (half <= 0) return val;
      let r = val % half;
      if (r > 0) r -= half; // keep within (-half, 0]
      return r;
    };
    const apply = () => {
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    apply();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (mode === "auto") {
        x = wrap(x + auto * dt);
        apply();
      } else if (mode === "inertia") {
        x = wrap(x + v * dt);
        v += (auto - v) * (1 - Math.exp(-dt / DECAY_TAU)); // ease velocity -> cadence
        if (Math.abs(v - auto) < 2) {
          v = auto;
          mode = "auto";
        }
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // ---- drag + flick ----
    let activePointer: number | null = null;
    let lastPointerX = 0;
    let samples: { t: number; x: number }[] = [];

    const onDown = (e: PointerEvent) => {
      if (e.button != null && e.button !== 0) return; // primary / touch only
      mode = "drag";
      activePointer = e.pointerId;
      lastPointerX = e.clientX;
      samples = [{ t: performance.now(), x: e.clientX }];
      viewport.setPointerCapture?.(e.pointerId);
      setDragging(true);
    };
    const onMove = (e: PointerEvent) => {
      if (mode !== "drag" || e.pointerId !== activePointer) return;
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      x = wrap(x + dx);
      apply();
      const t = performance.now();
      samples.push({ t, x: e.clientX });
      while (samples.length > 2 && t - samples[0].t > 110) samples.shift();
    };
    const endDrag = (e: PointerEvent) => {
      if (mode !== "drag" || e.pointerId !== activePointer) return;
      activePointer = null;
      setDragging(false);
      let flick = 0;
      if (samples.length >= 2) {
        const a = samples[0];
        const b = samples[samples.length - 1];
        const dtS = (b.t - a.t) / 1000;
        if (dtS > 0) flick = (b.x - a.x) / dtS;
      }
      flick = Math.max(-MAX_FLICK, Math.min(MAX_FLICK, flick));
      if (reducedMotion) {
        v = auto;
        mode = "auto"; // no inertia under reduced motion
        return;
      }
      v = flick;
      mode = "inertia";
    };

    const onResize = () => {
      half = measure();
      x = wrap(x);
      apply();
    };

    viewport.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", onResize);
    // Re-measure once fonts/images settle (offsets can shift after first paint).
    const remeasure = window.setTimeout(onResize, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(remeasure);
      viewport.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", onResize);
    };
  }, [isClient, reducedMotion, testimonials.items.length]);

  return (
    <div className="py-20 lg:py-28">
      <div className="px-gutter-m lg:px-gutter-d">
        <p data-about-reveal className="mb-10 text-sm font-medium text-white/45 md:mb-14">
          {testimonials.label}
        </p>
      </div>

      <div
        ref={viewportRef}
        data-about-reveal
        className={cn(
          // Vertical padding gives the hover lift + shadow + top border room INSIDE
          // the horizontal clip (overflow-x:hidden also clips vertically — you cannot
          // pair it with overflow-y:visible). The equal negative margin makes this
          // layout-neutral, so section rhythm is unchanged.
          "py-10 -my-10",
          isClient
            ? "overflow-hidden touch-pan-y select-none"
            : "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          isClient && (dragging ? "cursor-grabbing" : "cursor-grab"),
        )}
      >
        <div
          ref={trackRef}
          className={cn(
            "flex w-max gap-4 lg:gap-5 will-change-transform",
            // No-JS fallback only: CSS marquee (respects prefers-reduced-motion).
            !isClient && "animate-[marquee_48s_linear_infinite] motion-reduce:animate-none",
            // Suppress card hover jitter while a drag is in progress.
            dragging && "[&_.t-card]:pointer-events-none",
          )}
        >
          {loop.map((item, i) => {
            const featured = Boolean(item.featured);
            return (
              <article
                key={`${item.name}-${i}`}
                aria-hidden={i >= testimonials.items.length}
                className={cn(
                  "t-card relative flex w-[min(85vw,22rem)] shrink-0 flex-col overflow-hidden rounded-[1.75rem] p-7 sm:w-[24rem] sm:p-8",
                  // Tailwind v4 lifts via the `translate` property, so transition it.
                  "border border-transparent transition-[translate,box-shadow,border-color,filter] duration-[180ms] ease-out",
                  featured
                    ? "bg-orange text-black hover-fine:hover:-translate-y-1 hover-fine:hover:brightness-[1.04]"
                    // Shadow sized to fit within the viewport's ~40px vertical padding
                    // (extends ~36px below the card), so it's never clipped.
                    : "bg-[#2a2a2a] text-white ring-1 ring-white/8 hover-fine:hover:-translate-y-1.5 hover-fine:hover:border-orange/45 hover-fine:hover:shadow-[0_16px_36px_-16px_rgb(0_0_0_/_0.55)]",
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
                  &ldquo;
                </span>

                <p
                  className={cn(
                    "mt-3 flex-1 text-control leading-relaxed sm:text-base",
                    featured ? "text-black/90" : "text-white/80",
                  )}
                >
                  {item.quote}
                </p>

                <div className="mt-10 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className={cn("font-sans text-sm font-semibold", featured ? "text-black" : "text-white")}>
                      {item.name}
                    </p>
                    <p className={cn("mt-0.5 text-xs leading-snug", featured ? "text-black/55" : "text-white/40")}>
                      {item.role}
                    </p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logo}
                    alt=""
                    draggable={false}
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
