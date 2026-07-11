import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AppLink } from '@/components/ui/Link';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { aboutContent } from '@/content/about';

export function LeadershipCard() {
  const { leadership } = aboutContent;

  return (
    <section className="px-gutter-m py-32 lg:px-gutter-d">
      <SectionLabel>Leadership</SectionLabel>
      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
        <MediaPlaceholder
          label={leadership.name}
          className="aspect-square w-full max-w-[280px] rounded-lg"
          accent="from-navy to-orange/40"
        />
        <div>
          <DisplayHeading as="h2" size="display-xs" className="text-2xl">
            {leadership.name}
          </DisplayHeading>
          <BodyText muted className="mt-2 uppercase tracking-wide">
            {leadership.title}
          </BodyText>
          <BodyText className="mt-6 max-w-prose-fixed">{leadership.bio}</BodyText>
          <AppLink href={leadership.social} external variant="inline" className="mt-4 inline-block">
            @laith_alaqqad
          </AppLink>
        </div>
      </div>
    </section>
  );
}
