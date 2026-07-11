'use client';

import { AboutStatement } from '@/components/sections/AboutStatement';
import { AboutPills } from '@/components/sections/AboutPills';
import { AboutValues } from '@/components/sections/AboutValues';
import { LeadershipCard } from '@/components/sections/LeadershipCard';
import { AboutPopupMarquee } from '@/components/sections/AboutPopupMarquee';
import { CTABand } from '@/components/sections/CTABand';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';

export function AboutPageContent() {
  const scrollToValues = () => {
    document.getElementById('about-values')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <AboutStatement />
      <AboutPills onTellMeMore={scrollToValues} />
      <AboutValues />
      <LeadershipCard />
      <AboutPopupMarquee />
      <div className="grid gap-0 md:grid-cols-3">
        <MediaPlaceholder label="Who We Are" className="min-h-48" accent="from-charcoal to-navy" />
        <MediaPlaceholder label="What We Do" className="min-h-48" accent="from-navy to-black" />
        <MediaPlaceholder label="Why Us" className="min-h-48" accent="from-black to-orange/30" />
      </div>
      <CTABand title="Looking for the Better Future" />
    </>
  );
}
