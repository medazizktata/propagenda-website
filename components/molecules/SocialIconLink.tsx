import { AppLink } from '@/components/ui/Link';
import type { SocialLink } from '@/types/navigation';

const labels: Record<SocialLink['platform'], string> = {
  facebook: 'Facebook',
  threads: 'Threads',
  tiktok: 'TikTok',
  instagram: 'Instagram',
};

export function SocialIconLink({ link }: { link: SocialLink }) {
  return (
    <AppLink
      href={link.href}
      external
      variant="inline"
      className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm uppercase"
    >
      {labels[link.platform]}
    </AppLink>
  );
}
