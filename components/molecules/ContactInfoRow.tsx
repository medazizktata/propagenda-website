import { BodyText } from '@/components/ui/BodyText';

interface ContactInfoRowProps {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export function ContactInfoRow({ label, value, href, external }: ContactInfoRowProps) {
  return (
    <div>
      <BodyText as="p" size="text-sm" muted className="mb-1 uppercase">
        {label}
      </BodyText>
      {href ? (
        <a
          href={href}
          className="transition-hover text-white hover-fine:hover:text-orange"
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {value}
        </a>
      ) : (
        <BodyText as="p">{value}</BodyText>
      )}
    </div>
  );
}
