import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { HighlightText } from '@/components/ui/HighlightText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { aboutContent } from '@/content/about';

export function AboutValues() {
  return (
    <section id="about-values" className="border-t border-border bg-black px-gutter-m py-32 lg:px-gutter-d">
      <SectionLabel>What We Do</SectionLabel>
      <DisplayHeading as="h2" size="display-xs" className="mb-10 mt-4">
        Core Values
      </DisplayHeading>
      <ul className="grid gap-4 md:grid-cols-2">
        {aboutContent.values.map((value) => (
          <li
            key={value}
            className="rounded-lg border border-border bg-charcoal/80 p-6 text-lg font-medium"
          >
            <HighlightText>{value}</HighlightText>
          </li>
        ))}
      </ul>

      <SectionLabel className="mt-16">Why Us</SectionLabel>
      <BodyText size="text-xl" className="mt-4 max-w-prose-fixed">
        {aboutContent.whyUs}
      </BodyText>
      <div className="mt-8 flex flex-wrap gap-4">
        {aboutContent.pillars.map((pillar) => (
          <span
            key={pillar}
            className="rounded-pill border border-orange px-4 py-2 text-sm font-bold uppercase tracking-wide text-orange"
          >
            {pillar}
          </span>
        ))}
      </div>
    </section>
  );
}
