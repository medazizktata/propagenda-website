import { AboutImmersive } from "@/components/sections/about/AboutImmersive";
import { ServicesCTA } from "@/components/sections/services/ServicesCTA";
import { aboutContent } from "@/content/about";

/**
 * /about — SMV-inspired immersive statement journey.
 * Full-viewport acts + choice buttons + fail marquee + closing motif + CTA.
 */
export function AboutPageContent() {
  return (
    <>
      <AboutImmersive />
      <ServicesCTA heading={aboutContent.cta.heading} />
    </>
  );
}
