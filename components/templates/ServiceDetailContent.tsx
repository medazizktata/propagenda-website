'use client';

import { ProjectFixedHeader } from '@/components/sections/ProjectFixedHeader';
import { DetailOverview } from '@/components/sections/DetailOverview';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { TierTable } from '@/components/TierTable';
import { EventChecklist } from '@/components/EventChecklist';
import { ExtendedBulletList } from '@/components/ExtendedBulletList';
import { DesignPrintInstallStrip } from '@/components/sections/DesignPrintInstallStrip';
import { CTABand } from '@/components/sections/CTABand';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { ServiceRecord } from '@/types/content';

interface ServiceDetailContentProps {
  service: ServiceRecord;
}

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  return (
    <>
      <ProjectFixedHeader title={service.h1} />
      <DetailOverview
        title={service.h1}
        overview={service.overview}
        scopeItems={service.scopeItems}
        type="service"
      />
      {service.slug === 'graphics-production' && <DesignPrintInstallStrip compact />}
      {service.tiers && service.tiers.length > 0 && <TierTable tiers={service.tiers} />}
      {service.eventChecklist && service.eventChecklist.length > 0 && (
        <EventChecklist items={service.eventChecklist} />
      )}
      {service.extendedBullets && service.extendedBullets.length > 0 && (
        <ExtendedBulletList items={service.extendedBullets} />
      )}
      {service.relatedWork && service.relatedWork.length > 0 && (
        <section className="px-gutter-m pb-16 lg:px-gutter-d">
          <SectionLabel>
            {service.slug === 'photography-videography'
              ? 'Related Work'
              : service.slug === 'events'
                ? 'Event Branding Examples'
                : 'See Our Branding Work'}
          </SectionLabel>
          <div className="flex flex-wrap gap-4">
            {service.relatedWork.map((link) => (
              <Button key={link.href} href={link.href} variant="primary-ghost" size="md">
                {link.label}
              </Button>
            ))}
          </div>
        </section>
      )}
      <ProjectGallery images={service.gallery} />
      <CTABand tertiaryCta={service.tertiaryCta} />
    </>
  );
}
