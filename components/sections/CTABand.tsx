import { PageCTA } from '@/components/sections/PageCTA';

interface CTABandProps {
  line1?: string;
  line2?: string;
  support?: string;
  tertiaryCta?: { label: string; href: string };
}

/** @deprecated Prefer PageCTA / ClosingCTABand — kept as a thin alias. */
export function CTABand({ line1, line2, support, tertiaryCta }: CTABandProps) {
  return (
    <PageCTA
      line1={line1}
      line2={line2}
      support={support}
      secondary={
        tertiaryCta
          ? { label: tertiaryCta.label, href: tertiaryCta.href }
          : undefined
      }
    />
  );
}
