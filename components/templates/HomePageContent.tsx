import { Hero } from '@/components/sections/Hero';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { DesignPrintInstallPopup } from '@/components/sections/DesignPrintInstallPopup';
import { GrowthStaircase } from '@/components/sections/GrowthStaircase';
import { WorkSplitSection } from '@/components/sections/WorkSplitSection';
import { ClientLogoGrid } from '@/components/sections/ClientLogoGrid';
import { ContactSection } from '@/components/sections/ContactSection';
import { SeamlessActs } from '@/components/layout/SeamlessActs';

export function HomePageContent() {
  return (
    <>
      <SeamlessActs>
        <Hero />
        <ManifestoSection />
        <DesignPrintInstallPopup />
      </SeamlessActs>
      <GrowthStaircase />
      <WorkSplitSection />
      <SeamlessActs>
        <ClientLogoGrid />
        <ContactSection />
      </SeamlessActs>
    </>
  );
}
