import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import type { LegalRecord } from '@/types/content';
import { cn } from '@/components/ui/cn';

interface LegalPageContentProps {
  legal: LegalRecord;
}

export function LegalPageContent({ legal }: LegalPageContentProps) {
  const isImprint = legal.slug === 'imprint' || legal.centered;

  return (
    <article
      className={cn(
        'px-gutter-m lg:px-gutter-d',
        isImprint ? 'py-[20vh] text-center' : 'py-24',
      )}
    >
      <DisplayHeading
        as="h1"
        size={isImprint ? 'display-sm' : 'display-xs'}
        ghost={isImprint}
        className={cn(isImprint && 'mx-auto max-w-[90vw]')}
      >
        {legal.h1}
      </DisplayHeading>
      <div
        className={cn(
          'mt-12 space-y-10',
          isImprint ? 'mx-auto max-w-prose-fixed' : 'max-w-content-column',
        )}
      >
        {legal.sections.map((section) => (
          <section key={section.heading ?? section.paragraphs[0]}>
            {section.heading && (
              <DisplayHeading as="h2" size="display-xs" className="mb-4 text-xl">
                {section.heading}
              </DisplayHeading>
            )}
            <div className="space-y-4">
              {section.paragraphs.map((paragraph) => (
                <BodyText key={paragraph} muted={!section.heading && isImprint}>
                  {paragraph}
                </BodyText>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
