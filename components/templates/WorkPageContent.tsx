'use client';

import { WorkHero } from '@/components/sections/WorkHero';
import { WorkIndex } from '@/components/sections/WorkIndex';
import { ClosingCTABand } from '@/components/sections/ClosingCTABand';
import type { CaseStudyRecord } from '@/types/content';

const CATEGORY_ORDER = [
  'Automotive',
  'Property & interiors',
  'Healthcare & retail',
  'Industry & energy',
] as const;

export function WorkPageContent({ caseStudies }: { caseStudies: CaseStudyRecord[] }) {
  const categoryGroups = CATEGORY_ORDER.map((label) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    label,
    items: caseStudies.filter((study) => study.category === label),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <WorkHero caseStudies={caseStudies} />
      <WorkIndex groups={categoryGroups} />
      <ClosingCTABand />
    </>
  );
}
