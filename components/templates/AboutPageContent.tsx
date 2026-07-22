import { AboutHero } from '@/components/sections/about/AboutHero';
import { AboutMission } from '@/components/sections/about/AboutMission';
import { AboutValues } from '@/components/sections/about/AboutValues';
import { AboutPillars } from '@/components/sections/about/AboutPillars';
import { AboutLeadership } from '@/components/sections/about/AboutLeadership';
import { AboutVision } from '@/components/sections/about/AboutVision';
import { AboutCTA } from '@/components/sections/about/AboutCTA';

/**
 * /about — a bespoke, scroll-choreographed telling of the Propagenda story, grounded in the
 * real About content (name origin, mission, values, pillars, leadership, vision).
 *
 *   1. The name        — kinetic wordmark morph: propag[A]nda -> propag[E]nda
 *   2. The mission      — word-by-word manifesto reveal, pinned
 *   3. What we do        — one creed anchoring the four core values
 *   4. Why us            — the core-values line decomposed into three pillars
 *   5. Leadership        — the founder, in an editorial split
 *   6. The vision motif  — "Looking for the better future" kinetic marquee
 *   7. Close             — Contact Us
 */
export function AboutPageContent() {
  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutPillars />
      <AboutLeadership />
      <AboutVision />
      <AboutCTA />
    </>
  );
}
