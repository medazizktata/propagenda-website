import { ServicesStatement } from '@/components/sections/services/ServicesStatement';
import { ServicesIndex } from '@/components/sections/services/ServicesIndex';
import { ServicesWhy } from '@/components/sections/services/ServicesWhy';
import { ServicesCTA } from '@/components/sections/services/ServicesCTA';
import type { ServiceHubCard } from '@/content/servicesHub';

export function ServicesPageContent({ hubCards }: { hubCards: ServiceHubCard[] }) {
  return (
    <>
      <ServicesStatement />
      <ServicesIndex hubCards={hubCards} />
      <ServicesWhy />
      <ServicesCTA />
    </>
  );
}
