import { getCaseStudy } from '@/lib/content/getCaseStudy';
import type { CaseStudyRecord } from '@/types/content';

export function getCaseStudyNav(study: CaseStudyRecord) {
  const prevStudy = study.prev ? getCaseStudy(study.prev) : undefined;
  const nextStudy = study.next ? getCaseStudy(study.next) : undefined;

  return {
    prev: prevStudy
      ? { label: prevStudy.title, href: `/work/${prevStudy.slug}` }
      : undefined,
    next: nextStudy
      ? { label: nextStudy.title, href: `/work/${nextStudy.slug}` }
      : undefined,
  };
}
