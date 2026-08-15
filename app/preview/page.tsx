import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { DesignPrintInstallPopup } from '@/components/sections/DesignPrintInstallPopup';
import { SeamlessActs } from '@/components/layout/SeamlessActs';

// Lightweight "minified home" embedded in the Websites device-preview mockup
// (/services/websites → WebsitesShowcase). It renders only the first three home acts and then
// jumps straight to the site footer (SiteShell adds it) — the heavy middle sections (growth
// staircase, work split, client grid, contact) are dropped so the iframe stays cheap to load.
// Always requested with `?preview=1`, which disables the custom cursor, Lenis smooth-scroll
// and the intro loader (see CustomCursor / SmoothScroll / useInitLoader).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <SeamlessActs>
      <Hero />
      <ManifestoSection />
      <DesignPrintInstallPopup />
    </SeamlessActs>
  );
}
