import { buildMetadata } from '@/lib/seo/metadata';
import { StubPage } from '@/components/StubPage';

export const metadata = buildMetadata(
  {
    title: 'Blog | Propagenda',
    description:
      'Insights on branding, visual identity, typography, and color psychology from Propagenda Dubai.',
  },
  '/blog',
);

export default function BlogPage() {
  return <StubPage title="Blog" />;
}
