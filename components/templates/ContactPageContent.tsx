import { ContactRequestGrid } from "@/components/sections/ContactRequestGrid";
import { ContactStatement } from "@/components/sections/ContactStatement";
import { ContactCloser } from "@/components/sections/ContactCloser";

/** /contact — snap grid · kinetic bridge · manifesto + form closer. */
export function ContactPageContent() {
  return (
    <div className="bg-charcoal">
      <ContactRequestGrid />
      <ContactStatement />
      <ContactCloser />
    </div>
  );
}
