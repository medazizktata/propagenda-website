import { ContactInfoRow } from '@/components/molecules/ContactInfoRow';
import { footer } from '@/content/site';
import { whatsapp } from '@/content/contact';

interface ContactInfoBlockProps {
  showWhatsApp?: boolean;
}

export function ContactInfoBlock({ showWhatsApp = false }: ContactInfoBlockProps) {
  return (
    <div className="space-y-6">
      <ContactInfoRow
        label="Phone"
        value={footer.phone}
        href={`tel:${footer.phone.replace(/\s/g, '')}`}
      />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
        <ContactInfoRow label="Email" value={footer.email} href={`mailto:${footer.email}`} />
        {showWhatsApp ? (
          <ContactInfoRow
            label={whatsapp.label}
            value={whatsapp.display}
            href={whatsapp.href}
            external
          />
        ) : null}
      </div>
      <ContactInfoRow label="Address" value={footer.address} />
    </div>
  );
}
