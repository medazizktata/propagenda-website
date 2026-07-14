import { ServicesIndex } from '@/components/sections/services/ServicesIndex';
import { CTABand } from '@/components/sections/CTABand';

export function ServicesPageContent() {
  return (
    <>
      {/* ACT 2 — The Index (Act 1 statement + Act 3 marquee land in a later milestone). */}
      <ServicesIndex />
      <CTABand />
    </>
  );
}
