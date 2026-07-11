import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { ArrowCTA } from '@/components/ArrowCTA';

interface ContactSplitHeroProps {
  columns: Array<{
    line1: string;
    line2: string;
    ctaLabel: string;
    ctaTarget: string;
  }>;
}

export function ContactSplitHero({ columns }: ContactSplitHeroProps) {
  return (
    <section className="grid border-b border-border md:grid-cols-2">
      {columns.map((column, index) => (
        <div
          key={column.line1}
          className={
            index === 0
              ? 'relative flex min-h-[50vh] flex-col items-center justify-center bg-gradient-to-br from-navy to-black px-gutter-m py-[10vw] text-center lg:px-gutter-d'
              : 'relative flex min-h-[50vh] flex-col items-center justify-center bg-gradient-to-bl from-charcoal to-black px-gutter-m py-[10vw] text-center lg:px-gutter-d'
          }
        >
          <DisplayHeading as="p" size="display-sm" ghost className="max-w-full">
            {column.line1}
          </DisplayHeading>
          <DisplayHeading as="p" size="display-xs" className="mt-4">
            {column.line2}
          </DisplayHeading>
          <ArrowCTA label={column.ctaLabel} href={column.ctaTarget} />
        </div>
      ))}
    </section>
  );
}
