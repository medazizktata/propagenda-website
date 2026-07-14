import { ServicesStatement } from '@/components/sections/services/ServicesStatement';
import { ServicesIndex } from '@/components/sections/services/ServicesIndex';
import { CTABand } from '@/components/sections/CTABand';

export function ServicesPageContent() {
  return (
    <>
      {/* ACT 1 — Statement */}
      <ServicesStatement />
      {/* ACT 2 — The Index */}
      <ServicesIndex />
      {/* ACT 3 — Close: contact CTA (the global footer already carries the brand marquee). */}
      <CTABand />
    </>
  );
}
