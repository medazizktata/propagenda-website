'use client';

import { PageHero } from '@/components/sections/PageHero';
import { WorkOverviewList } from '@/components/sections/WorkOverviewList';
import { LogoWallGrid } from '@/components/sections/LogoWallGrid';
import { ClosingCTABand } from '@/components/sections/ClosingCTABand';
import { CTABand } from '@/components/sections/CTABand';
import {
  workHubHeading,
  featuredWorkEntries,
  moreWorkEntries,
  logoGridBrands,
} from '@/content/workHub';

export function WorkPageContent() {
  return (
    <>
      <PageHero title={workHubHeading} fixed ghost />
      <WorkOverviewList id="featured" title="Featured Work" entries={featuredWorkEntries} />
      <WorkOverviewList id="more" title="More Work" entries={moreWorkEntries} />
      <LogoWallGrid brands={logoGridBrands} />
      <ClosingCTABand />
      <CTABand title="Looking for the Better Future" />
    </>
  );
}
