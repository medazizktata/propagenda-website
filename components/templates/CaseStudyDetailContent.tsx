'use client';

import { ProjectFixedHeader } from '@/components/sections/ProjectFixedHeader';
import { DetailOverview } from '@/components/sections/DetailOverview';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { ProjectPrevNext } from '@/components/sections/ProjectPrevNext';
import { CTABand } from '@/components/sections/CTABand';
import { getCaseStudyNav } from '@/lib/content/getCaseStudyNav';
import type { CaseStudyRecord } from '@/types/content';

interface CaseStudyDetailContentProps {
  study: CaseStudyRecord;
}

export function CaseStudyDetailContent({ study }: CaseStudyDetailContentProps) {
  const nav = getCaseStudyNav(study);

  return (
    <>
      <ProjectFixedHeader title={study.h1} />
      <DetailOverview
        title={study.h1}
        overview={study.overview}
        scopeItems={study.scopeItems}
        type="case-study"
      />
      <ProjectGallery images={study.gallery} />
      <ProjectPrevNext prev={nav.prev} next={nav.next} />
      <CTABand />
    </>
  );
}
