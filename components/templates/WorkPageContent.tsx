'use client';

import { WorkHero } from '@/components/sections/WorkHero';
import { WorkIndex } from '@/components/sections/WorkIndex';
import { ClosingCTABand } from '@/components/sections/ClosingCTABand';
import type { CaseStudyRecord } from '@/types/content';

// Preferred display order for the categories we know about today. Any category that
// actually appears in the data but isn't listed here is appended after these, in the
// order it's first seen — so a case study is never silently dropped just because its
// category predates this list.
const PREFERRED_CATEGORY_ORDER = [
  'Automotive',
  'Property & interiors',
  'Healthcare & retail',
  'Industry & energy',
] as const;

function toGroupId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function WorkPageContent({ caseStudies }: { caseStudies: CaseStudyRecord[] }) {
  const seen = new Set<string>();
  const orderedCategories: string[] = [];

  for (const label of PREFERRED_CATEGORY_ORDER) {
    if (!seen.has(label) && caseStudies.some((study) => study.category === label)) {
      seen.add(label);
      orderedCategories.push(label);
    }
  }
  for (const study of caseStudies) {
    if (!seen.has(study.category)) {
      seen.add(study.category);
      orderedCategories.push(study.category);
    }
  }

  const rawGroups = orderedCategories.map((label) => ({
    id: toGroupId(label),
    label,
    items: caseStudies.filter((study) => study.category === label),
  })).filter((group) => group.items.length > 0);

  // A category with exactly one study earns its own full section heading nowhere else on
  // the site — visually it reads as an orphan, not a group. Fold every singleton into one
  // shared "More work" group instead of giving each a lonely standalone section.
  const multiItemGroups = rawGroups.filter((group) => group.items.length > 1);
  const singletonItems = rawGroups.filter((group) => group.items.length === 1).flatMap((g) => g.items);
  const categoryGroups = singletonItems.length > 0
    ? [...multiItemGroups, { id: 'more-work', label: 'More work', items: singletonItems }]
    : multiItemGroups;

  return (
    <>
      <WorkHero caseStudies={caseStudies} />
      <WorkIndex groups={categoryGroups} />
      <ClosingCTABand />
    </>
  );
}
