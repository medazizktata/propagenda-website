import { PageCTA } from '@/components/sections/PageCTA';

interface ServicesCTAProps {
  line1?: string;
  line2?: string;
  support?: string;
  /** Optional secondary link (e.g. a service's tertiary CTA — "Book your shoot"). */
  tertiary?: { label: string; href: string };
}

/**
 * Subpage closer — same charcoal + pulse-glow format as About / Work / case studies.
 * Used on the services hub and each service detail page.
 */
export function ServicesCTA({
  line1 = "Let's build it",
  line2 = 'together.',
  support,
  tertiary,
}: ServicesCTAProps) {
  return (
    <PageCTA
      line1={line1}
      line2={line2}
      support={support}
      secondary={
        tertiary
          ? { label: tertiary.label, href: tertiary.href }
          : { label: 'Start a project', href: '/contact' }
      }
    />
  );
}
