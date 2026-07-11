import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';

interface ExtendedBulletListProps {
  items: string[];
}

export function ExtendedBulletList({ items }: ExtendedBulletListProps) {
  return (
    <section className="px-gutter-m pb-16 lg:px-gutter-d">
      <DisplayHeading as="h2" size="display-xs" className="mb-6 text-2xl">
        Digital Focus Areas
      </DisplayHeading>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-orange/30 bg-orange/5 px-5 py-4 text-sm font-bold uppercase tracking-wide text-orange"
          >
            <BodyText as="span">{item}</BodyText>
          </li>
        ))}
      </ul>
    </section>
  );
}
