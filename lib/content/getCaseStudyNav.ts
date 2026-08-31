import { getCaseStudy } from '@/lib/content/getCaseStudy';
import type { CaseStudyRecord } from '@/types/content';

export async function getCaseStudyNav(study: CaseStudyRecord) {
  const [prevStudy, nextStudy] = await Promise.all([
    study.prev ? getCaseStudy(study.prev) : Promise.resolve(undefined),
    study.next ? getCaseStudy(study.next) : Promise.resolve(undefined),
  ]);

  return {
    prev: prevStudy
      ? { label: prevStudy.title, href: `/work/${prevStudy.slug}` }
      : undefined,
    next: nextStudy
      ? { label: nextStudy.title, href: `/work/${nextStudy.slug}` }
      : undefined,
  };
}
