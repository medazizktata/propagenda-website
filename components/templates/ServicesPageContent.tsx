import { ServicesStatement } from '@/components/sections/services/ServicesStatement';
import { ServicesIndex } from '@/components/sections/services/ServicesIndex';
import { ServicesWhy } from '@/components/sections/services/ServicesWhy';
import { ServicesCTA } from '@/components/sections/services/ServicesCTA';

export function ServicesPageContent() {
  return (
    <>
      {/* ACT 1 — Statement */}
      <ServicesStatement />
      {/* ACT 2 — The Index */}
      <ServicesIndex />
      {/* ACT 3 — Why the studio + client proof */}
      <ServicesWhy />
      {/* ACT 4 — Close: bold orange CTA (the global footer carries the brand marquee). */}
      <ServicesCTA />
    </>
  );
}
