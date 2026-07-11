import { BodyText } from '@/components/ui/BodyText';

interface ContactInfoRowProps {
  label: string;
  value: string;
  href?: string;
}

export function ContactInfoRow({ label, value, href }: ContactInfoRowProps) {
  return (
    <div>
      <BodyText as="p" size="text-sm" muted className="mb-1 uppercase">
        {label}
      </BodyText>
      {href ? (
        <a href={href} className="text-white hover-fine:hover:text-orange">
          {value}
        </a>
      ) : (
        <BodyText as="p">{value}</BodyText>
      )}
    </div>
  );
}
