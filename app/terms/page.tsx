import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPageContent } from '@/components/sections/LegalPageContent';
import { legalBySlug } from '@/content/legal';

export const metadata = buildMetadata(legalBySlug.terms.seo, '/terms');

export default function TermsPage() {
  return <LegalPageContent legal={legalBySlug.terms} />;
}
