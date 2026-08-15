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
  // `flat` renders each act at natural height with no scroll-pins/scrubs, so the embed is a
  // plain, scrollable page — the full-page pin choreography doesn't survive a short, scaled
  // iframe (it mismeasures, rams the nav into the hero and eats the scroll).
  return (
    <SeamlessActs>
      <Hero flat />
      <ManifestoSection flat />
      <DesignPrintInstallPopup flat />
    </SeamlessActs>
  );
}
