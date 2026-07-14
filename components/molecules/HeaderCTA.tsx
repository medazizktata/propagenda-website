import { Button } from '@/components/ui/Button';

export function HeaderCTA() {
  return (
    <Button
      href="/contact"
      size="sm"
      className="hidden min-h-0 px-3.5 py-1.5 text-[0.65rem] tracking-[0.12em] md:inline-flex"
    >
      Contact Us
    </Button>
  );
}
