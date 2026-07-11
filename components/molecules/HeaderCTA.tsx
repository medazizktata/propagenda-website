import { Button } from '@/components/ui/Button';

export function HeaderCTA() {
  return (
    <Button href="/contact" size="sm" className="hidden md:inline-flex">
      Contact Us
    </Button>
  );
}
