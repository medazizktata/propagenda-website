import { cn } from './cn';

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-semibold uppercase tracking-wider text-orange', className)}>
      {children}
    </p>
  );
}
