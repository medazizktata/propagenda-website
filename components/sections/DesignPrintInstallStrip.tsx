import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { designPrintInstall } from '@/content/home';

interface DesignPrintInstallStripProps {
  compact?: boolean;
}

export function DesignPrintInstallStrip({ compact = false }: DesignPrintInstallStripProps) {
  return (
    <section
      className={
        compact
          ? 'border-y border-border px-gutter-m py-12 text-center lg:px-gutter-d'
          : 'border-y border-border bg-black/40 px-gutter-m py-20 text-center lg:px-gutter-d'
      }
    >
      <DisplayHeading as="h2" size={compact ? 'display-xs' : 'display-sm'}>
        {designPrintInstall.headline}
      </DisplayHeading>
      <BodyText as="p" size="text-lg" muted className="mt-4 uppercase tracking-wider">
        {designPrintInstall.subline}
      </BodyText>
    </section>
  );
}
