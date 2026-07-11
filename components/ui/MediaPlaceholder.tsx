import { cn } from '@/components/ui/cn';

interface MediaPlaceholderProps {
  label: string;
  className?: string;
  accent?: string;
}

export function MediaPlaceholder({ label, className, accent = 'from-navy to-charcoal' }: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex items-end bg-gradient-to-br p-6 text-sm font-semibold uppercase tracking-wider text-white/80',
        accent,
        className,
      )}
      aria-hidden
    >
      {label}
    </div>
  );
}
