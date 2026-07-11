'use client';

import { PageHero } from '@/components/sections/PageHero';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { DesignPrintInstallStrip } from '@/components/sections/DesignPrintInstallStrip';
import { CTABand } from '@/components/sections/CTABand';
import { servicesHubHeading } from '@/content/servicesHub';
import { getServiceHubCards } from '@/lib/content/getServiceHubCards';

export function ServicesPageContent() {
  const services = getServiceHubCards();

  return (
    <>
      <PageHero title={servicesHubHeading} fixed ghost />
      <ServiceGrid services={services} columns={2} />
      <DesignPrintInstallStrip />
      <CTABand />
    </>
  );
}
