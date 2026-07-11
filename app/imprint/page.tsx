import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPageContent } from '@/components/sections/LegalPageContent';
import { legalBySlug } from '@/content/legal';

export const metadata = buildMetadata(legalBySlug.imprint.seo, '/imprint');

export default function ImprintPage() {
  return <LegalPageContent legal={legalBySlug.imprint} />;
}
