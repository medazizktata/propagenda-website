"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AboutImmersive } from "@/components/sections/about/AboutImmersive";
import { AboutManifesto } from "@/components/sections/about/AboutManifesto";
import { AboutStudio } from "@/components/sections/about/AboutStudio";
import { AboutStats } from "@/components/sections/about/AboutStats";
import { ServicesCTA } from "@/components/sections/services/ServicesCTA";
import { aboutContent } from "@/content/about";
import { cn } from "@/components/ui/cn";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * /about — the OLD and NEW looks interleaved into one narrative, launched by a click:
 *
 *  1. AboutImmersive — the SMV click-to-advance statement journey. Last milestone
 *     fires `onLaunch`.
 *  2. AboutManifesto — reading reveal + "Play it safe?" gate.
 *  3. Aftermath (studio → stats → CTA) stays collapsed while the gate is active;
 *     the on-brand answer (NO) expands it with a smooth fade-up, then the manifesto
 *     glides into that content.
 *
 * Before launch / reduced-motion: aftermath stays fully visible so nobody is trapped.
 */
export function AboutPageContent() {
  const [launched, setLaunched] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const reducedMotion = useReducedMotion();

  const gateLocksRest = launched && !reducedMotion;
  const restOpen = !gateLocksRest || unlocked;

  const handleUnlock = useCallback(() => setUnlocked(true), []);

  return (
    <>
      <AboutImmersive onLaunch={() => setLaunched(true)} />

      <AboutManifesto
        launched={launched}
        aftermathOpen={restOpen}
        onUnlock={handleUnlock}
      />

      <AboutAftermath open={restOpen} animateIn={gateLocksRest && unlocked} />
    </>
  );
}

/** Studio + stats + CTA — collapsed until the gate unlocks (motion path only). */
function AboutAftermath({
  open,
  animateIn,
}: {
  open: boolean;
  /** True only when revealing after the on-brand gate answer (not on first paint). */
  animateIn: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (!open) {
      gsap.set(el, { autoAlpha: 0, y: 0 });
      return;
    }

    if (!animateIn || reducedMotion) {
      gsap.set(el, { autoAlpha: 1, y: 0, clearProps: "transform" });
      requestAnimationFrame(() => {
        window.__lenis?.resize();
        ScrollTrigger.refresh();
      });
      return;
    }

    registerGsap();
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 64 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(el, { clearProps: "transform" });
          window.__lenis?.resize();
          ScrollTrigger.refresh();
        },
      },
    );
  }, [open, animateIn, reducedMotion]);

  return (
    <div
      ref={wrapRef}
      aria-hidden={!open}
      inert={!open ? true : undefined}
      className={cn(
        "relative",
        !open && "pointer-events-none h-0 overflow-hidden",
      )}
    >
      <AboutStudio />
      <AboutStats />
      <ServicesCTA line1={aboutContent.cta.line1} line2={aboutContent.cta.line2} />
    </div>
  );
}
