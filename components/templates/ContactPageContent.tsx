import { ContactRequestGrid } from "@/components/sections/ContactRequestGrid";
import { ContactStatement } from "@/components/sections/ContactStatement";
import { ContactInvite } from "@/components/sections/ContactInvite";
import { ContactTalkForm } from "@/components/sections/ContactTalkForm";

/** /contact — snap grid → team note → invite → form. */
export function ContactPageContent() {
  return (
    <div className="snap-y snap-proximity scroll-smooth bg-charcoal">
      <ContactRequestGrid />
      <ContactStatement />
      <ContactInvite />
      <ContactTalkForm />
    </div>
  );
}
