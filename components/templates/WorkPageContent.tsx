'use client';

import { WorkHero } from '@/components/sections/WorkHero';
import { WorkIndex } from '@/components/sections/WorkIndex';
import { ClosingCTABand } from '@/components/sections/ClosingCTABand';
import { allCaseStudies } from '@/content/work';

// Real case studies (with their heroImages, client, industry, year) drive the index —
// now grouped by broad industry category rather than the legacy featured/more tier.
// Explicit order so the hub reads deliberately; empty categories are dropped.
const CATEGORY_ORDER = [
  'Automotive',
  'Property & interiors',
  'Healthcare & retail',
  'Industry & energy',
] as const;

const categoryGroups = CATEGORY_ORDER.map((label) => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  label,
  items: allCaseStudies.filter((c) => c.category === label),
})).filter((group) => group.items.length > 0);

export function WorkPageContent() {
  return (
    <>
      <WorkHero />
      <WorkIndex groups={categoryGroups} />
      <ClosingCTABand />
    </>
  );
}
