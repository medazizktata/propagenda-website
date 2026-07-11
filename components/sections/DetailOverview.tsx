import { SectionLabel } from '@/components/ui/SectionLabel';
import { BodyText } from '@/components/ui/BodyText';

interface DetailOverviewProps {
  title: string;
  overview: string;
  scopeItems: string[];
  type: 'service' | 'case-study';
}

export function DetailOverview({ title, overview, scopeItems, type }: DetailOverviewProps) {
  return (
    <section className="px-gutter-m pb-16 lg:px-gutter-d">
      <h2 className="sr-only">{title}</h2>
      <SectionLabel>{type === 'service' ? 'Project Overview' : 'Case Study Overview'}</SectionLabel>
      <BodyText className="max-w-prose-fixed">{overview}</BodyText>
      {scopeItems.length > 0 && (
        <ul className="mt-8 max-w-prose-fixed space-y-3">
          {scopeItems.map((item) => (
            <li key={item} className="flex gap-3 text-sm uppercase tracking-wide">
              <span className="text-orange" aria-hidden>
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
