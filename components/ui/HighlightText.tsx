import type { ReactNode } from 'react';
import { cn } from './cn';

export function HighlightText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-orange', className)}>{children}</span>;
}
