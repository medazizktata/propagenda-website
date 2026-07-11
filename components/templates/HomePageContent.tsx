import { Hero } from '@/components/sections/Hero';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { DesignPrintInstallPopup } from '@/components/sections/DesignPrintInstallPopup';
import { MethodologySection } from '@/components/sections/MethodologySection';
import { WorkSplitSection } from '@/components/sections/WorkSplitSection';
import { ClientLogoGrid } from '@/components/sections/ClientLogoGrid';
import { BlogTeaserGrid } from '@/components/sections/BlogTeaserGrid';
import { ContactSection } from '@/components/sections/ContactSection';

export function HomePageContent() {
  return (
    <>
      <Hero />
      <ManifestoSection />
      <DesignPrintInstallPopup />
      <MethodologySection />
      <WorkSplitSection />
      <ClientLogoGrid />
      <BlogTeaserGrid />
      <ContactSection />
    </>
  );
}
