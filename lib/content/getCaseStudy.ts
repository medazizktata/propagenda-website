import { caseStudiesBySlug } from '@/content/work';
import type { CaseStudyRecord, WorkSlug } from '@/types/content';

export function getCaseStudy(slug: WorkSlug): CaseStudyRecord | undefined {
  return caseStudiesBySlug[slug];
}

export function getAllCaseStudies(): CaseStudyRecord[] {
  return Object.values(caseStudiesBySlug);
}
