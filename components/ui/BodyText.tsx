import type { ElementType, ReactNode } from 'react';
import { cn } from './cn';

interface BodyTextProps {
  as?: 'p' | 'span' | 'div' | 'li';
  size?: 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';
  muted?: boolean;
  children: ReactNode;
  className?: string;
}

export function BodyText({
  as: Tag = 'p',
  size = 'text-base',
  muted,
  children,
  className,
}: BodyTextProps) {
  const Component = Tag as ElementType;

  return (
    <Component className={cn(size, muted && 'text-muted', className)}>{children}</Component>
  );
}
