import { PageCTA } from '@/components/sections/PageCTA';

interface ClosingCTABandProps {
  line1?: string;
  line2?: string;
  support?: string;
}

export function ClosingCTABand({
  line1 = "We'd like to add yours",
  line2 = 'to the list.',
  support,
}: ClosingCTABandProps) {
  return <PageCTA line1={line1} line2={line2} support={support} />;
}
