"use client";

import { useState } from "react";
import { AboutImmersive } from "@/components/sections/about/AboutImmersive";
import { AboutManifesto } from "@/components/sections/about/AboutManifesto";
import { AboutStudio } from "@/components/sections/about/AboutStudio";
import { ServicesCTA } from "@/components/sections/services/ServicesCTA";
import { aboutContent } from "@/content/about";

/**
 * /about — the OLD and NEW looks interleaved into one narrative, launched by a click:
 *
 *  1. AboutImmersive — the SMV click-to-advance statement journey (the first thing on
 *     the page). Its LAST milestone IS the manifesto's opening line, "WE MAKE BRANDS
 *     IMPOSSIBLE TO IGNORE."; its button fires `onLaunch`.
 *  2. Seam A (button-launch): that click sets `launched`, which arms AboutManifesto —
 *     it glides the reader off the milestone, runs its typing reveal + "Play it safe?"
 *     gate, and on NO glides to its "…refuse to be forgotten." closer, then STOPS.
 *  3. Seam B (manifesto → studio tie): the manifesto's self-play halts at its own
 *     section end (never running into the old content); the reader continues into
 *     AboutStudio on the shared charcoal ground, whose reveals fade up on scroll.
 *  4. AboutStudio renders the editorial intro + principles, then AboutServices and
 *     AboutTestimonials.
 *  5. Exactly one closing CTA at the very end.
 *
 * `launched` is the single source of truth for Seam A. Before it flips, the manifesto
 * renders fully bright, ungated and scrollable, so reduced-motion / no-JS / skip-ahead
 * readers see everything and nobody is trapped.
 */
export function AboutPageContent() {
  const [launched, setLaunched] = useState(false);

  return (
    <>
      {/* OLD look opens — its last milestone launches the manifesto */}
      <AboutImmersive onLaunch={() => setLaunched(true)} />

      {/* NEW look — armed by the click, ties its closer into the studio below */}
      <AboutManifesto launched={launched} />

      {/* OLD look continues: studio intro + principles → services → testimonials */}
      <AboutStudio />

      {/* One CTA, at the true end of the page */}
      <ServicesCTA line1={aboutContent.cta.line1} line2={aboutContent.cta.line2} />
    </>
  );
}
