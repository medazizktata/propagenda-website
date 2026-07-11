import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';

interface EventChecklistProps {
  items: string[];
}

export function EventChecklist({ items }: EventChecklistProps) {
  return (
    <section className="px-gutter-m pb-16 lg:px-gutter-d">
      <DisplayHeading as="h2" size="display-xs" className="mb-6 text-2xl">
        We Take Care of Everything For Your Event
      </DisplayHeading>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-border bg-navy/40 px-5 py-4 text-sm font-bold uppercase tracking-wide"
          >
            <BodyText as="span">{item}</BodyText>
          </li>
        ))}
      </ul>
    </section>
  );
}
