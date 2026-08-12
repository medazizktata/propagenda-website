import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/cn';

interface HeaderCTAProps {
  className?: string;
}

export function HeaderCTA({ className }: HeaderCTAProps) {
  return (
    <Button
      href="/contact"
      size="sm"
      className={cn(
        'min-h-0 px-6 py-2.5 text-[0.65rem] tracking-[0.12em]',
        className,
      )}
    >
      Contact Us
    </Button>
  );
}
