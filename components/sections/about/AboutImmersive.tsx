"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { useRouter } from "next/navigation";
import { RoughNotation } from "react-rough-notation";
import { aboutContent, type AboutSegment, type AboutStatement } from "@/content/about";
import { cn } from "@/components/ui/cn";
import { CursorHollowPattern } from "@/components/ui/CursorHollowPattern";
import { gsap, registerGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * SMV-style about: stacked full-viewport statements.
 * Pass advances with a smooth word reveal. Fail triggers a twisted marquee overlay.
 * The LAST milestone IS the manifesto's opening line ("WE MAKE BRANDS IMPOSSIBLE TO
 * IGNORE.", circled IMPOSSIBLE); its button calls `onLaunch` to start the manifesto.
 *
 * @param onLaunch Fired by the last milestone's button — arms the manifesto below
 *   (typing reveal + gate). Under reduced motion this component also scrolls to the
 *   manifesto so nobody is stranded on the immersive.
 */
export function AboutImmersive({ onLaunch }: { onLaunch?: () => void }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const failRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [failMsg, setFailMsg] = useState<string | null>(null);
  const { statements } = aboutContent;

  const flashWords = useCallback(
    (panel: HTMLElement | null) => {
      if (!panel) return;
      const words = panel.querySelectorAll<HTMLElement>("[data-about-word]");
      if (reducedMotion || words.length === 0) {
        gsap.set(words, { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1 });
        return;
      }
      gsap.killTweensOf(words);
      words.forEach((w) => {
        gsap.set(w, {
          autoAlpha: 0,
          x: (Math.random() - 0.5) * window.innerWidth * 0.9,
          y: (Math.random() - 0.5) * window.innerHeight * 0.6,
          rotation: (Math.random() - 0.5) * 50,
          scale: 0.4 + Math.random() * 1.2,
        });
      });
      gsap.to(words, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.02,
        ease: "back.out(1.4)",
      });
    },
    [reducedMotion],
  );

  // Flash the opening statement once after mount.
  useEffect(() => {
    flashWords(panelRefs.current[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (next: number) => {
    setFailMsg(null);
    if (failRef.current) gsap.set(failRef.current, { autoAlpha: 0 });
    setIndex(next);
    // Flash after paint so the new panel is in the DOM as active.
    requestAnimationFrame(() => flashWords(panelRefs.current[next]));
  };

  const onPass = (statement: AboutStatement, i: number) => {
    if (statement.launch) {
      // Last milestone: launch the manifesto below (typing reveal + gate). Under
      // motion the manifesto glides itself down from here; under reduced motion its
      // choreography is inert, so scroll the reader into it so they're not stranded.
      onLaunch?.();
      if (reducedMotion) {
        const el = document.getElementById("about-manifesto");
        if (el) {
          const headerOffset = 96;
          window.scrollTo(
            0,
            Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset),
          );
        }
      }
      return;
    }
    if (statement.passHref) {
      router.push(statement.passHref);
      return;
    }
    if (statement.passScrollId) {
      const el = document.getElementById(statement.passScrollId);
      if (!el) return;
      const headerOffset = 96;
      const targetY =
        el.getBoundingClientRect().top + window.scrollY - headerOffset;
      if (reducedMotion) {
        window.scrollTo(0, targetY);
        return;
      }
      const proxy = { y: window.scrollY };
      gsap.killTweensOf(proxy);
      gsap.to(proxy, {
        y: Math.max(0, targetY),
        duration: 1.45,
        ease: "power3.inOut",
        onUpdate: () => window.scrollTo(0, proxy.y),
      });
      return;
    }
    if (i < statements.length - 1) goTo(i + 1);
  };

  const onFail = (msg: string) => {
    setFailMsg(msg);
  };

  // Drive the fail marquee from state so React re-renders copy, then GSAP reveals it.
  useEffect(() => {
    const el = failRef.current;
    if (!el || !failMsg) return;
    gsap.killTweensOf(el);
    const rows = el.querySelectorAll<HTMLElement>("[data-fail-row]");
    if (reducedMotion) {
      gsap.set(el, { autoAlpha: 1 });
      gsap.set(rows, { autoAlpha: 1 });
    } else {
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        rows,
        { autoAlpha: 0, xPercent: -8 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }
    const hide = gsap.delayedCall(1.9, () => {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.35,
        onComplete: () => setFailMsg(null),
      });
    });
    return () => {
      hide.kill();
    };
  }, [failMsg, reducedMotion]);

  return (
    <>
      <section
        className="relative h-svh overflow-hidden bg-charcoal"
        aria-label="About Propagenda"
      >
        <CursorHollowPattern className="z-0" />

        {statements.map((statement, i) => {
          const active = i === index;
          return (
            <article
              key={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center px-gutter-m pb-14 pt-[calc(var(--header-height)+2.25rem)] text-center sm:px-10 md:px-12 lg:px-gutter-d lg:pb-10 lg:pt-[var(--header-height)]",
                active ? "z-[1]" : "pointer-events-none z-0",
              )}
              style={{ visibility: active ? "visible" : "hidden" }}
              aria-hidden={!active}
            >
              {/* Mobile: full width inside gutters so type can breathe. Desktop: SMV ~65vw block. */}
              <p
                className="w-full max-w-[20.5rem] font-sans font-extrabold uppercase leading-[0.82] tracking-[-0.02em] sm:max-w-none sm:w-[min(88vw,64.95vw)] sm:leading-[0.75] lg:w-[min(92vw,64.95vw)]"
                style={{ fontSize: "clamp(2.35rem, 7.2vw, 7.5rem)" }}
              >
                {statement.segments.map((seg: AboutSegment, si) => (
                  <StatementWords
                    key={si}
                    text={seg.text}
                    accent={seg.accent}
                    annotate={seg.annotate}
                    active={active}
                  />
                ))}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-6 sm:gap-4 lg:mt-[2.1vw]">
                <ChoiceButton onClick={() => onPass(statement, i)}>
                  {statement.pass}
                </ChoiceButton>
                {statement.fail ? (
                  <ChoiceButton quiet onClick={() => onFail(statement.fail!)}>
                    {statement.fail}
                  </ChoiceButton>
                ) : null}
              </div>
            </article>
          );
        })}

        {/* Fail overlay — full-bleed tilted orange marquee (SMV about-popup). */}
        <div
          ref={failRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 flex items-center overflow-hidden bg-charcoal"
          style={{
            visibility: failMsg ? "visible" : "hidden",
            opacity: failMsg ? 1 : 0,
          }}
        >
          <div className="flex w-[140%] -translate-x-[12%] -rotate-[10deg] flex-col gap-[0.05em]">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                data-fail-row
                className="flex w-max animate-[marquee_14s_linear_infinite] motion-reduce:animate-none"
                style={{ animationDuration: `${12 + row * 3}s` }}
              >
                {Array.from({ length: 10 }).map((_, n) => (
                  <span
                    key={n}
                    className="mr-[0.2em] whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-[-0.02em] text-orange"
                    style={{ fontSize: "clamp(3.5rem, 14vw, 11rem)" }}
                  >
                    {failMsg ?? ""}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function StatementWords({
  text,
  accent,
  annotate,
  active,
}: {
  text: string;
  accent?: boolean;
  annotate?: "circle" | "underline";
  active?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  // The hand-drawn mark draws once the words have flown into place (flashWords), and
  // only while this panel is the active one, so it lands on the settled type.
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    // Draw the mark shortly after this panel becomes active (once the flashed words
    // have settled). Panels only ever advance forward, so there is no reset to do.
    if (!annotate || !active) return;
    const t = window.setTimeout(() => setDrawn(true), reducedMotion ? 0 : 540);
    return () => window.clearTimeout(t);
  }, [annotate, active, reducedMotion]);

  const words = text.split(/(\s+)/).map((w, i) =>
    w.trim() === "" ? (
      <span key={i}>{w}</span>
    ) : (
      <span
        key={i}
        data-about-word
        className={cn("inline-block", accent ? "text-orange" : "text-white")}
      >
        {w}
      </span>
    ),
  );

  // The circled run (IMPOSSIBLE, on the last milestone) is interactive: magnetic pull
  // + re-ink on hover, a scribble redraw + scale punch + orange flash on click.
  if (annotate === "circle") {
    return (
      <MagneticInkWord drawn={drawn} active={!!active} reducedMotion={reducedMotion}>
        {words}
      </MagneticInkWord>
    );
  }

  if (annotate === "underline") {
    return (
      <RoughNotation
        type="underline"
        show={drawn}
        animate={!reducedMotion}
        color="#f58b27"
        strokeWidth={3}
        padding={[3, 2]}
        animationDuration={600}
        multiline={false}
      >
        <span className="inline-block whitespace-nowrap">{words}</span>
      </RoughNotation>
    );
  }

  return <>{words}</>;
}

/**
 * IMPOSSIBLE — the keyword that must be impossible to ignore.
 *
 * Hover: the circled word is magnetically pulled toward the cursor (gsap.quickTo) and
 * its hand-drawn circle re-inks (a fresh rough-notation stroke via a remount key).
 * Click / Enter / Space: an emphatic beat — the circle scribbles again, the word does
 * a scale "punch", and an orange glow flashes; repeated clicks re-fire.
 *
 * Reduced motion: no magnetic pull, no punch — the circle simply (re)draws statically.
 * It is a real <button>, so it stays keyboard-focusable and operable either way.
 */
function MagneticInkWord({
  children,
  drawn,
  active,
  reducedMotion,
}: {
  children: ReactNode;
  drawn: boolean;
  active: boolean;
  reducedMotion: boolean;
}) {
  const magnetRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const quickRef = useRef<{
    xTo: ReturnType<typeof gsap.quickTo>;
    yTo: ReturnType<typeof gsap.quickTo>;
  } | null>(null);
  // Bumping this remounts the RoughNotation, which re-strokes the circle (re-ink).
  const [inkKey, setInkKey] = useState(0);

  // Magnetic follow — only while this panel is active and motion is allowed.
  useEffect(() => {
    if (!active || reducedMotion) return;
    const el = magnetRef.current;
    if (!el) return;
    registerGsap();
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    quickRef.current = { xTo, yTo };
    return () => {
      quickRef.current = null;
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0, scale: 1 });
    };
  }, [active, reducedMotion]);

  const reInk = () => {
    if (drawn) setInkKey((k) => k + 1);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const q = quickRef.current;
    const el = magnetRef.current;
    if (!q || !el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const cap = (val: number, m: number) => Math.max(-m, Math.min(m, val));
    q.xTo(cap(dx * 0.28, 24));
    q.yTo(cap(dy * 0.4, 15));
  };
  const onPointerEnter = () => reInk();
  const onPointerLeave = () => {
    const q = quickRef.current;
    if (q) {
      q.xTo(0);
      q.yTo(0);
    }
  };
  const onPunch = (e: SyntheticEvent) => {
    e.stopPropagation();
    reInk();
    if (reducedMotion) return;
    registerGsap();
    const el = magnetRef.current;
    const btn = btnRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { scale: 1 },
        { scale: 1.14, duration: 0.19, ease: "power2.out", yoyo: true, repeat: 1 },
      );
    }
    if (btn) {
      gsap.fromTo(
        btn,
        { textShadow: "0 0 0px rgba(245,139,39,0)" },
        { textShadow: "0 0 36px rgba(245,139,39,0.85)", duration: 0.17, ease: "power2.out", yoyo: true, repeat: 1 },
      );
    }
  };

  return (
    <span ref={magnetRef} className="relative inline-block align-baseline will-change-transform">
      <RoughNotation
        key={inkKey}
        type="circle"
        show={drawn}
        animate={!reducedMotion}
        color="#f58b27"
        strokeWidth={2.6}
        padding={[-6, 4]}
        animationDuration={600}
        multiline={false}
      >
        <button
          ref={btnRef}
          type="button"
          aria-label="impossible"
          onPointerMove={onPointerMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onClick={onPunch}
          className={cn(
            "inline-block cursor-pointer whitespace-nowrap appearance-none border-0 bg-transparent p-0 [font:inherit] text-inherit",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange",
          )}
        >
          {children}
        </button>
      </RoughNotation>
    </span>
  );
}

function ChoiceButton({
  children,
  onClick,
  quiet,
}: {
  children: ReactNode;
  onClick: () => void;
  quiet?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-full px-7 py-3 font-sans text-sm font-bold uppercase tracking-[0.14em]",
        quiet
          ? "border border-white/30 bg-transparent text-white hover-fine:hover:border-white/70"
          : "bg-orange text-ink hover-fine:hover:bg-white hover-fine:hover:text-navy",
        "transition-[transform,background-color,color,border-color] duration-300 ease-out",
        "hover-fine:hover:-translate-y-0.5",
        "active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
      )}
    >
      {children}
    </button>
  );
}
