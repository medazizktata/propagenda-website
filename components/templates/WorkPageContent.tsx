'use client';

import { PageHero } from '@/components/sections/PageHero';
import { WorkIndex } from '@/components/sections/WorkIndex';
import { LogoWallGrid } from '@/components/sections/LogoWallGrid';
import { ClosingCTABand } from '@/components/sections/ClosingCTABand';
import { workHubHeading, logoGridBrands } from '@/content/workHub';
import { allCaseStudies } from '@/content/work';

// Real case studies (with their heroImages, client, industry, year) drive the index —
// grouped by the authored tier so Featured leads and More follows.
const featured = allCaseStudies.filter((c) => c.tier === 'featured');
const more = allCaseStudies.filter((c) => c.tier === 'more');

export function WorkPageContent() {
  return (
    <>
      <PageHero
        title={workHubHeading}
        subtitle="A selection of the brands we've built, refined, and launched — identity to interface."
        fixed
        ghost
      />
      <WorkIndex
        groups={[
          { id: 'featured', label: 'Featured work', items: featured },
          { id: 'more', label: 'More work', items: more },
        ]}
      />
      <LogoWallGrid brands={logoGridBrands} />
      <ClosingCTABand />
    </>
  );
}
