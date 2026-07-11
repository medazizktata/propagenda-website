import type { ElementType, ReactNode } from 'react';
import { cn } from './cn';

type DisplaySize =
  | 'display-xs'
  | 'display-sm'
  | 'display-md'
  | 'display-lg'
  | 'display-xl'
  | 'display-2xl'
  | 'nav-mobile';

interface DisplayHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  size?: DisplaySize;
  ghost?: boolean;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<DisplaySize, string> = {
  'display-xs': 'text-display-xs',
  'display-sm': 'text-display-sm',
  'display-md': 'text-display-md',
  'display-lg': 'text-display-lg',
  'display-xl': 'text-display-xl',
  'display-2xl': 'text-display-2xl',
  'nav-mobile': 'text-nav-mobile',
};

export function DisplayHeading({
  as: Tag = 'h2',
  size = 'display-sm',
  ghost,
  children,
  className,
}: DisplayHeadingProps) {
  const Component = Tag as ElementType;

  return (
    <Component
      className={cn(
        'font-sans font-bold uppercase tracking-display',
        sizeClasses[size],
        ghost && 'text-ghost',
        className,
      )}
    >
      {children}
    </Component>
  );
}
