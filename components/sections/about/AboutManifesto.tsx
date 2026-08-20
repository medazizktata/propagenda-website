"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { RoughNotation } from "react-rough-notation";
import {
  aboutContent,
  type ManifestoBlock,
  type ManifestoToken,
} from "@/content/about";
import { cn } from "@/components/ui/cn";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/* Reading-highlight palette. Words rest dimmed and brighten to their target in
   strict reading order (spatzek.studio device). Applied as inline styles by GSAP
   ONLY — the markup renders BRIGHT by default, so with no JS / reduced-motion / before
   launch the copy is fully legible. */
const DIM_WHITE = "rgba(255,255,255,0.24)";
const DIM_ORANGE = "rgba(245,139,39,0.30)";
/* Mobile: deeper dim so the light-up reads as a punch, not a tint shift. */
const DIM_WHITE_MOBILE = "rgba(255,255,255,0.12)";
const DIM_ORANGE_MOBILE = "rgba(245,139,39,0.16)";
const BRIGHT_WHITE = "#ffffff";
const BRIGHT_ORANGE = "#f58b27";

/* Hand-drawn marks (rough-notation). Stable module-level config. */
const INK = "#f58b27";
const UNDERLINE_PAD: [number, number] = [3, 2];

/* Auto-play: one continuous, constant-speed linear scroll (px per second).
   Mobile runs slower so each word has time to land. */
const AUTO_SPEED = 230;
const AUTO_SPEED_MOBILE = 145;
const RAMP_DIST = 140;
const SETTLE_DIST = 150;
/* Word reveal timing (timeline units — only the RATIO matters under scrub). */
const WORD_STEP = 1;
const WORD_DUR = 1.05;
const WORD_STEP_MOBILE = 1.2;
const WORD_DUR_MOBILE = 1.4;

const isNarrowViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const isAccent = (el: Element) => el.classList.contains("text-orange");
const brightFor = (el: Element) => (isAccent(el) ? BRIGHT_ORANGE : BRIGHT_WHITE);
const dimFor = (el: Element, mobile = false) => {
  if (isAccent(el)) return mobile ? DIM_ORANGE_MOBILE : DIM_ORANGE;
  return mobile ? DIM_WHITE_MOBILE : DIM_WHITE;
};

function prefersReducedMotion(reduced: boolean) {
  return (
    reduced ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

/* Hydration-safe "are we on the client?" flag — false during SSR + first hydration
   render (all content ships visible for no-JS), true thereafter. */
const noopSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Lets a hand-drawn mark ask to be drawn exactly when the highlight lights its word. */
type RegisterMark = (el: HTMLElement, show: () => void) => () => void;
const AnnotationRevealContext = createContext<RegisterMark | null>(null);

/**
 * /about — the scroll-illuminated manifesto, LAUNCHED by a click.
 *
 * It opens DIRECTLY on its first body paragraph (no restated hero — the immersive's
 * last milestone already showed "WE MAKE BRANDS IMPOSSIBLE TO IGNORE."). When the
 * `launched` prop turns true (the milestone's SHOW ME button was clicked) it:
 *   1. glides the reader off the immersive and into the manifesto (Phase A, quick),
 *   2. auto-scrolls at a constant reading cadence (Phase B), brightening the body
 *      word-by-word in document order as each paragraph passes the reading line,
 *   3. STOPS at the "Play it safe?" gate that follows the last paragraph and walls
 *      forward scroll until answered. NO ("Correct.") resumes the glide into the old
 *      content below; YES ("Ha, no.") holds.
 *
 * There is NO wheel/pointer takeover — the auto-scroll is authoritative through the
 * manifesto, so a stray trackpad event can't kill it (the previous bug).
 *
 * Legible-by-default & reduced-motion / no-JS / pre-launch safe: none of the dim,
 * the gate wall, or the auto-scroll exist until `launched` is true under motion, so
 * everything renders bright and freely scrollable and nobody is ever trapped.
 *
 * `onUnlock` opens the aftermath (studio+) in the parent. Glide-out waits until
 * `aftermathOpen` is true so layout height exists before we scroll into it.
 */
export function AboutManifesto({
  launched,
  aftermathOpen = true,
  onUnlock,
}: {
  launched: boolean;
  /** Parent has expanded studio+ (or never gated it). */
  aftermathOpen?: boolean;
  /** On-brand gate answer — parent reveals the rest of the page. */
  onUnlock?: () => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { body } = aboutContent;

  // The gate is a one-way latch: NO resumes the auto-scroll into the old content.
  const unlockedRef = useRef(false);
  const resumedRef = useRef(false);
  const gateYRef = useRef<number | null>(null);
  const resumeRef = useRef<(() => void) | null>(null);
  // The gate only APPEARS once the final paragraph before it has finished revealing.
  const [qaRevealed, setQaRevealed] = useState(false);
  const isClient = useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);
  // The gate/dim/auto-scroll exist only on the client, with motion, AND once launched.
  const gateActive = isClient && !prefersReducedMotion(reducedMotion) && launched;

  const handleUnlock = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    onUnlock?.();
  }, [onUnlock]);

  // After the parent expands aftermath, refresh layout and glide into it.
  useEffect(() => {
    if (!aftermathOpen || !unlockedRef.current || resumedRef.current) return;
    resumedRef.current = true;
    const id = requestAnimationFrame(() => {
      window.__lenis?.resize();
      ScrollTrigger.refresh();
      resumeRef.current?.();
    });
    return () => cancelAnimationFrame(id);
  }, [aftermathOpen]);

  // Registry: reveal-driven marks register here so the timeline can fire them in sync.
  const marks = useRef(new Map<HTMLElement, () => void>());
  const registerMark = useCallback<RegisterMark>((el, show) => {
    marks.current.set(el, show);
    return () => marks.current.delete(el);
  }, []);

  /* ---- Sequential reading highlight + mark sync ----
     Runs only once LAUNCHED. Words dim, then re-light word-by-word as the launch
     glide scrolls the body through the reading band. The scrub is pinned to the SAME
     scroll span the auto-glide travels (reveal start -> the gate), so typing tracks
     the auto-scroll exactly. */
  useEffect(() => {
    const root = rootRef.current;
    const bodyEl = bodyRef.current;
    if (!root || !bodyEl || prefersReducedMotion(reducedMotion) || !launched) return;
    registerGsap();

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    // Progress 0 sits where Phase A lands (first paragraph low in the viewport, dim).
    const revealStartY = () => {
      const first = bodyEl.querySelector<HTMLElement>("[data-reveal-block]");
      const el = first ?? bodyEl;
      return Math.round(
        Math.min(
          Math.max(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.58),
          maxScroll(),
        ),
      );
    };
    // Progress 1 sits where the auto-scroll stops: the gate, held in the upper viewport.
    const revealEndY = () => {
      const el = bodyEl.querySelector<HTMLElement>("[data-decision]");
      if (!el) return maxScroll();
      return Math.round(
        Math.min(Math.max(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.28), maxScroll()),
      );
    };

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", bodyEl); // document order
      if (!words.length) return;
      const mobile = isNarrowViewport();
      const wordStep = mobile ? WORD_STEP_MOBILE : WORD_STEP;
      const wordDur = mobile ? WORD_DUR_MOBILE : WORD_DUR;

      gsap.set(words, {
        color: (_i, t) => dimFor(t as Element, mobile),
        ...(mobile ? { y: 14, force3D: true } : { y: 0 }),
      });

      // Which word (the last of an annotated run) should fire which mark.
      const wordToShow = new Map<HTMLElement, () => void>();
      marks.current.forEach((show, el) => {
        const runWords = el.querySelectorAll<HTMLElement>("[data-word]");
        const last = runWords[runWords.length - 1];
        if (last) wordToShow.set(last, show);
        else show();
      });

      // The gate appears once the paragraph before it fully reveals: the last body
      // word ahead of the Yes/No triggers the gate's entrance as it lights.
      const decision = bodyEl.querySelector<HTMLElement>("[data-decision]");
      let qaTriggerWord: HTMLElement | null = null;
      if (decision) {
        const afterIdx = words.findIndex(
          (w) => !!(decision.compareDocumentPosition(w) & Node.DOCUMENT_POSITION_FOLLOWING),
        );
        const lastBefore = afterIdx === -1 ? words.length - 1 : afterIdx - 1;
        if (lastBefore >= 0) qaTriggerWord = words[lastBefore];
      }

      const markWatch: { threshold: number; show: () => void; fired: boolean }[] = [];
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bodyEl,
          start: () => revealStartY(),
          end: () => revealEndY(),
          scrub: mobile ? 0.55 : 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            for (const m of markWatch) {
              if (!m.fired && self.progress >= m.threshold) {
                m.fired = true;
                m.show();
              }
            }
          },
        },
      });
      words.forEach((w, i) => {
        tl.to(
          w,
          {
            color: brightFor(w),
            y: 0,
            duration: wordDur,
            ease: "none",
          },
          i * wordStep,
        );
        const show = wordToShow.get(w);
        if (show) markWatch.push({ threshold: i * wordStep + wordDur, show, fired: false });
        if (w === qaTriggerWord) {
          markWatch.push({
            threshold: i * wordStep + wordDur,
            show: () => setQaRevealed(true),
            fired: false,
          });
        }
      });
      const totalDur = tl.totalDuration() || 1;
      markWatch.forEach((m) => {
        m.threshold = m.threshold / totalDur;
      });
    }, root);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion, launched]);

  /* ---------- Launched auto-scroll (glide in -> reading cadence -> gate -> resume) ----------
     No takeover: the glide is authoritative until the gate, so a stray wheel/trackpad
     event can't kill it. Only a forward WALL holds the reader at the gate until NO. */
  useEffect(() => {
    const root = rootRef.current;
    const bodyEl = bodyRef.current;
    if (!root || !bodyEl || prefersReducedMotion(reducedMotion) || !launched) return;
    registerGsap();

    let tween: gsap.core.Animation | null = null;
    let startTimer: number | undefined;
    let gateY = Number.POSITIVE_INFINITY;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    // Phase A target: first paragraph settled low in the viewport, still dim.
    const enterY = () => {
      const first = bodyEl.querySelector<HTMLElement>("[data-reveal-block]");
      const el = first ?? bodyEl;
      return Math.round(
        Math.min(
          Math.max(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.58),
          maxScroll(),
        ),
      );
    };
    // Where the auto-scroll stops: the gate, held in the upper viewport.
    const gateStopY = () => {
      const el = root.querySelector<HTMLElement>("[data-decision]");
      if (!el) return maxScroll();
      return Math.round(
        Math.min(Math.max(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.28), maxScroll()),
      );
    };
    // Where the resume (after NO) stops: the manifesto's end scrolled UP so the old
    // content below (AboutStudio) sits just under the header — i.e. we glide FORWARD
    // out of the manifesto and into the studio, then release. (This must be past the
    // gate stop, so the section bottom goes near the viewport TOP, not its bottom.)
    const studioRevealY = () =>
      Math.round(
        Math.min(Math.max(0, root.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.12), maxScroll()),
      );

    /* ---- Forward wall: block scrolling PAST the gate while locked ---- */
    const clampForward = () => {
      if (unlockedRef.current) return;
      if (window.scrollY > gateY + 1) window.scrollTo(0, gateY);
    };
    const onScroll = () => clampForward();
    const onResize = () => {
      if (!unlockedRef.current) {
        gateY = gateStopY();
        gateYRef.current = gateY;
        clampForward();
      }
      ScrollTrigger.refresh();
    };
    const removeGateListeners = () => {
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", onResize);
    };

    // Reading-cadence glide: ease-in ramp -> constant cruise -> ease-out settle, with
    // continuous velocity across the phases (no lurch, no wall).
    const speed = isNarrowViewport() ? AUTO_SPEED_MOBILE : AUTO_SPEED;
    const smoothGlide = (toY: number, onDone?: () => void) => {
      const fromY = window.scrollY;
      const total = toY - fromY;
      if (total <= 4) {
        onDone?.();
        return;
      }
      const apply = (p: { y: number }) => window.scrollTo(0, p.y);
      const proxy = { y: fromY };
      const tl = gsap.timeline({
        onComplete: () => {
          tween = null;
          onDone?.();
        },
      });
      const ramp = Math.min(RAMP_DIST, total * 0.35);
      const settle = Math.min(SETTLE_DIST, total * 0.35);
      const rampTo = fromY + ramp;
      const settleFrom = toY - settle;
      const cruiseDist = settleFrom - rampTo;
      if (ramp > 1) {
        tl.to(proxy, { y: rampTo, duration: (2 * ramp) / speed, ease: "power1.in", onUpdate: () => apply(proxy) });
      }
      if (cruiseDist > 1) {
        tl.to(proxy, { y: settleFrom, duration: cruiseDist / speed, ease: "none", onUpdate: () => apply(proxy) });
      }
      tl.to(proxy, { y: toY, duration: Math.max(0.3, (2 * settle) / speed), ease: "power1.out", onUpdate: () => apply(proxy) });
      tween = tl;
    };

    // Phase A: a quicker eased glide that carries the reader off the immersive
    // milestone and down into the manifesto, before the reading cadence takes over.
    const quickGlide = (toY: number, onDone?: () => void) => {
      const fromY = window.scrollY;
      if (Math.abs(toY - fromY) <= 4) {
        onDone?.();
        return;
      }
      const proxy = { y: fromY };
      const tl = gsap.timeline({
        onComplete: () => {
          tween = null;
          onDone?.();
        },
      });
      tl.to(proxy, {
        y: toY,
        duration: isNarrowViewport() ? 1.55 : 1.2,
        ease: "power2.inOut",
        onUpdate: () => window.scrollTo(0, proxy.y),
      });
      tween = tl;
    };

    // Phase A (enter) -> Phase B (read to the gate) -> hold and reveal the gate.
    const runIn = () => {
      quickGlide(enterY(), () => {
        gateY = gateStopY();
        gateYRef.current = gateY;
        smoothGlide(gateY, () => setQaRevealed(true));
      });
    };

    // Resume after NO: drop the wall, glide to the manifesto's end (old content
    // begins), then release. If already there, just release.
    const runOut = () => {
      removeGateListeners();
      tween?.kill();
      if (studioRevealY() - window.scrollY <= 4) return;
      smoothGlide(studioRevealY());
    };
    resumeRef.current = runOut;

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onResize);

    // Arm the wall as layout settles, so nothing slips past the gate before it stops.
    const armRaf = requestAnimationFrame(() => {
      if (!unlockedRef.current) {
        gateY = gateStopY();
        gateYRef.current = gateY;
      }
    });

    // A short beat after the click, then glide in and read to the gate.
    startTimer = window.setTimeout(runIn, 600);

    return () => {
      cancelAnimationFrame(armRaf);
      window.clearTimeout(startTimer);
      tween?.kill();
      removeGateListeners();
      resumeRef.current = null;
    };
  }, [reducedMotion, launched]);

  // The gate stays hidden until the paragraph before it has revealed (motion only).
  const qaHidden = gateActive && !qaRevealed;

  return (
    <AnnotationRevealContext.Provider value={registerMark}>
      <section
        ref={rootRef}
        id="about-manifesto"
        aria-label="About Propagenda"
        className="relative overflow-hidden bg-charcoal"
      >
        {/* Illuminated body — opens on the first paragraph (no hero). Dim -> bright
            word-by-word under the launched auto-scroll; bright by default otherwise. */}
        <div
          ref={bodyRef}
          className={cn(
            "mx-auto flex w-full max-w-5xl flex-col gap-[12vh] px-6 pt-[calc(var(--header-height)+13vh)] sm:px-10 lg:px-gutter-d",
            /* Extra floor while aftermath is collapsed so the gate isn't flush to the page end. */
            aftermathOpen ? "pb-[20vh]" : "pb-[42vh]",
          )}
        >
          {body.map((block, i) => (
            <Block
              key={i}
              block={block}
              onUnlock={handleUnlock}
              qaHidden={block.kind === "qa" ? qaHidden : undefined}
            />
          ))}
        </div>
      </section>
    </AnnotationRevealContext.Provider>
  );
}

/** Renders one manifesto block: plain lines, or the interactive Q&A gate. */
function Block({
  block,
  onUnlock,
  qaHidden,
}: {
  block: ManifestoBlock;
  onUnlock?: () => void;
  qaHidden?: boolean;
}) {
  if (block.kind === "qa")
    return <QAChoice block={block} onUnlock={onUnlock} hidden={qaHidden} />;
  return (
    <p
      data-reveal-block
      className="font-sans font-bold uppercase leading-[1.1] tracking-[-0.01em]"
      style={{ fontSize: "clamp(1.5rem, 4.6vw, 3.35rem)" }}
    >
      {block.lines.map((line, i) => (
        <span key={i} className="block">
          <Tokens tokens={line} />
        </span>
      ))}
    </p>
  );
}

/**
 * Splits each token into per-word spans (so the highlight brightens word-by-word),
 * carrying the accent colour and any hand-drawn annotation.
 */
function Tokens({ tokens }: { tokens: ManifestoToken[] }) {
  return (
    <>
      {tokens.map((tok, ti) => {
        const parts = tok.text.split(/(\s+)/);
        const words = parts.map((part, wi) =>
          part.trim() === "" ? (
            <span key={wi}>{part}</span>
          ) : (
            <span
              key={wi}
              data-word
              className={cn("inline-block", tok.accent ? "text-orange" : "text-white")}
            >
              {part}
            </span>
          ),
        );

        if (tok.annotate) {
          return (
            <InkMark key={ti} type={tok.annotate}>
              {words}
            </InkMark>
          );
        }
        return <span key={ti}>{words}</span>;
      })}
    </>
  );
}

/**
 * A hand-drawn rough-notation mark. Reveal-driven marks draw exactly when the
 * reading-highlight lights their word (via the timeline); under reduced motion every
 * mark renders instantly & static. Never re-tied to scroll (no redraw/jitter).
 */
function InkMark({
  type,
  children,
}: {
  type: "circle" | "underline";
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const register = useContext(AnnotationRevealContext);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inReveal = !!el.closest("[data-reveal-block]");
    // Reduced motion, or no reveal available -> draw promptly. Otherwise the reveal
    // timeline fires show() as it lights this word.
    if (!inReveal || prefersReducedMotion(reducedMotion) || !register) {
      const id = window.setTimeout(() => setShown(true), inReveal ? 0 : 500);
      return () => window.clearTimeout(id);
    }
    return register(el, () => setShown(true));
  }, [reducedMotion, register]);

  return (
    <RoughNotation
      type={type}
      show={shown}
      animate={!reducedMotion}
      color={INK}
      strokeWidth={3}
      padding={UNDERLINE_PAD}
      animationDuration={isNarrowViewport() ? 900 : 600}
      multiline={false}
    >
      <span ref={ref} className="inline-block whitespace-nowrap">
        {children}
      </span>
    </RoughNotation>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive YES / NO — the END gate. NO resumes into the old content. */
/* ------------------------------------------------------------------ */

function QAChoice({
  block,
  onUnlock,
  hidden = false,
}: {
  block: Extract<ManifestoBlock, { kind: "qa" }>;
  onUnlock?: () => void;
  /** Kept in layout but hidden until the last paragraph has finished revealing. */
  hidden?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const replyRef = useRef<HTMLSpanElement>(null);

  // No default selection: -1 means nothing picked yet. The hand-drawn circle is the
  // USER'S mark — it only appears once they actually choose.
  const [index, setIndex] = useState(-1);
  const [qaShown, setQaShown] = useState(false);
  const [answered, setAnswered] = useState(false);
  const selected = index >= 0 ? block.options[index] : undefined;
  const rovingIndex = index >= 0 ? index : 0;

  // Reveal the circle once the decision first enters view (draw once).
  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setQaShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Playful response once answered (and whenever the answer switches).
  useEffect(() => {
    if (!answered) return;
    if (prefersReducedMotion(reducedMotion)) return;
    registerGsap();
    if (replyRef.current) {
      gsap.fromTo(
        replyRef.current,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "back.out(2)" },
      );
    }
    const btn = optionRefs.current[index];
    if (btn && selected && !selected.onBrand) {
      gsap.fromTo(btn, { x: -6 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, answered]);

  const select = (next: number, focus: boolean) => {
    const n = block.options.length;
    const i = ((next % n) + n) % n;
    setIndex(i);
    setAnswered(true);
    if (focus) optionRefs.current[i]?.focus();
    // The RIGHT answer (onBrand === NO) resumes the auto-scroll into the old content.
    if (block.options[i].onBrand) onUnlock?.();
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const from = index >= 0 ? index : rovingIndex;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        select(from + 1, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        select(from - 1, true);
        break;
      case "Home":
        e.preventDefault();
        e.stopPropagation();
        select(0, true);
        break;
      case "End":
        e.preventDefault();
        e.stopPropagation();
        select(block.options.length - 1, true);
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      data-decision
      aria-hidden={hidden || undefined}
      className="flex flex-col items-start gap-4 transition-opacity duration-500 ease-out motion-reduce:transition-none"
      style={hidden ? { opacity: 0, visibility: "hidden" } : undefined}
    >
      <p
        className="font-sans font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white/70"
        style={{ fontSize: "clamp(1.2rem, 3.4vw, 2.35rem)" }}
      >
        {block.question}
      </p>

      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={block.question}
        onKeyDown={onKeyDown}
        className="inline-flex flex-wrap items-center gap-x-12 gap-y-2"
      >
        {block.options.map((opt, i) => {
          const active = i === index;
          return (
            <RoughNotation
              key={opt.label}
              type="circle"
              show={qaShown && active}
              animate={!reducedMotion}
              color={INK}
              strokeWidth={2.4}
              padding={[6, 10]}
              animationDuration={550}
              multiline={false}
            >
              <button
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={i === rovingIndex ? 0 : -1}
                onClick={() => select(i, true)}
                className={cn(
                  "relative z-[1] font-sans font-extrabold uppercase leading-none tracking-[-0.01em]",
                  "transition-[color,transform] duration-300 ease-out",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange",
                  active ? "text-orange" : "text-white/55 hover-fine:hover:text-white/85",
                )}
                style={{ fontSize: "clamp(2rem, 6.2vw, 4rem)" }}
              >
                {opt.label}
              </button>
            </RoughNotation>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="min-h-[1.4em] font-sans font-semibold uppercase tracking-label"
        style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.4rem)" }}
      >
        <span
          ref={replyRef}
          className={cn("inline-block", selected?.onBrand ? "text-orange" : "text-white/55")}
        >
          {answered ? selected?.reply : ""}
        </span>
      </p>
    </div>
  );
}
