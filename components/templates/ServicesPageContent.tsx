import { ServicesStatement } from '@/components/sections/services/ServicesStatement';
import { ServicesIndex } from '@/components/sections/services/ServicesIndex';
import { ServicesCTA } from '@/components/sections/services/ServicesCTA';

export function ServicesPageContent() {
  return (
    <>
      {/* ACT 1 — Statement */}
      <ServicesStatement />
      {/* ACT 2 — The Index */}
      <ServicesIndex />
      {/* ACT 3 — Close: bold orange CTA (the global footer carries the brand marquee). */}
      <ServicesCTA />
    </>
  );
}
