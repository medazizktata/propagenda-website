"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { aboutContent, type AboutStatement } from "@/content/about";
import { cn } from "@/components/ui/cn";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * SMV-style about: stacked full-viewport statements.
 * Pass advances with a smooth word reveal. Fail triggers a twisted marquee overlay.
 * Final pass scrolls into the studio section.
 */
export function AboutImmersive() {
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
        className="relative h-screen overflow-hidden bg-charcoal"
        aria-label="About Propagenda"
      >
        {statements.map((statement, i) => {
          const active = i === index;
          return (
            <article
              key={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center px-4 pt-[var(--header-height)] text-center sm:px-8",
                active ? "z-[1]" : "pointer-events-none z-0",
              )}
              style={{ visibility: active ? "visible" : "hidden" }}
              aria-hidden={!active}
            >
              {/* SMV: ~65vw block, ~8.3vw type, line-height ~0.75 */}
              <p
                className="w-[min(92vw,64.95vw)] font-sans font-extrabold uppercase leading-[0.75] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2.6rem, 8.1vw, 7.5rem)" }}
              >
                {statement.segments.map((seg, si) => (
                  <StatementWords
                    key={si}
                    text={seg.text}
                    accent={seg.accent}
                  />
                ))}
              </p>

              <div className="mt-[2.1vw] flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <ChoiceButton onClick={() => onPass(statement, i)}>
                  {statement.pass}
                </ChoiceButton>
                {statement.fail ? (
                  <ChoiceButton onClick={() => onFail(statement.fail!)}>
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

function StatementWords({ text, accent }: { text: string; accent?: boolean }) {
  const words = text.split(/(\s+)/);
  return (
    <>
      {words.map((w, i) =>
        w.trim() === "" ? (
          <span key={i}>{w}</span>
        ) : (
          <span
            key={i}
            data-about-word
            className={cn(
              "inline-block",
              accent ? "text-orange" : "text-white",
            )}
          >
            {w}
          </span>
        ),
      )}
    </>
  );
}

function ChoiceButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-full bg-orange px-7 py-3 font-sans text-sm font-bold uppercase tracking-[0.14em] text-white",
        "transition-[transform,background-color,color] duration-300 ease-out",
        "hover-fine:hover:-translate-y-0.5 hover-fine:hover:bg-white hover-fine:hover:text-navy",
        "active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
      )}
    >
      {children}
    </button>
  );
}
