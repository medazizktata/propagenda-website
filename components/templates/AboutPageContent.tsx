import { AboutImmersive } from "@/components/sections/about/AboutImmersive";
import { AboutStudio } from "@/components/sections/about/AboutStudio";
import { ServicesCTA } from "@/components/sections/services/ServicesCTA";
import { aboutContent } from "@/content/about";

/**
 * /about — mix:
 * 1) SMV immersive statement journey
 * 2) Plusdrie editorial studio body
 * 3) Orange CTA bookend
 */
export function AboutPageContent() {
  return (
    <>
      <AboutImmersive />
      <AboutStudio />
      <ServicesCTA heading={aboutContent.cta.heading} />
    </>
  );
}
