import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPageContent } from '@/components/sections/LegalPageContent';
import { legalBySlug } from '@/content/legal';

export const metadata = buildMetadata(legalBySlug.privacy.seo, '/privacy');

export default function PrivacyPage() {
  return <LegalPageContent legal={legalBySlug.privacy} />;
}
