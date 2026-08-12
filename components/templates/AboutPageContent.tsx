import { AboutImmersive } from "@/components/sections/about/AboutImmersive";
import { AboutStudio } from "@/components/sections/about/AboutStudio";
import { PageCTA } from "@/components/sections/PageCTA";

/**
 * /about — mix:
 * 1) SMV immersive statement journey
 * 2) Plusdrie editorial studio body
 * 3) Canonical PageCTA closer
 */
export function AboutPageContent() {
  return (
    <>
      <AboutImmersive />
      <AboutStudio />
      <PageCTA />
    </>
  );
}
