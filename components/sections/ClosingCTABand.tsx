import { CTABand } from '@/components/sections/CTABand';

interface ClosingCTABandProps {
  copy?: string;
}

export function ClosingCTABand({
  copy = "WE'D LIKE TO ADD YOURS TO THE LIST",
}: ClosingCTABandProps) {
  return <CTABand title={copy} />;
}
