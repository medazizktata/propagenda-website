import { BillboardHero } from '@/components/sections/BillboardHero';
import { CubeHero } from '@/components/sections/cube-hero/CubeHero';
import { Hero } from '@/components/sections/Hero';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { DesignPrintInstallPopup } from '@/components/sections/DesignPrintInstallPopup';
import { GrowthStaircase } from '@/components/sections/GrowthStaircase';
import { WorkSplitSection } from '@/components/sections/WorkSplitSection';
import { ClientLogoGrid } from '@/components/sections/ClientLogoGrid';
import { SeamlessActs } from '@/components/layout/SeamlessActs';
import { heroVariant, isPageUnlocked } from '@/lib/featureFlags';

export function HomePageContent() {
  return (
    <>
      <SeamlessActs>
        {/* Two openers, switched by NEXT_PUBLIC_HERO_VARIANT. `heroVariant` folds to a literal
            at build time, so the branch not taken — and its scene code — can be dropped rather
            than shipped alongside the one in use. */}
        {heroVariant === 'cubes' ? <CubeHero /> : <BillboardHero />}
        <Hero />
        <ManifestoSection />
        <DesignPrintInstallPopup />
      </SeamlessActs>
      <GrowthStaircase />
      {isPageUnlocked('work') ? <WorkSplitSection /> : null}
      <ClientLogoGrid />
    </>
  );
}
