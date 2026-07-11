import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from './cn';

type LinkVariant = 'nav' | 'footer' | 'inline' | 'ghost';

interface AppLinkProps {
  href: string;
  variant?: LinkVariant;
  active?: boolean;
  external?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<LinkVariant, string> = {
  nav: 'font-bold uppercase tracking-wide text-white hover-fine:hover:text-orange',
  footer: 'text-base uppercase font-bold hover-fine:hover:text-orange lg:text-2xl',
  inline: 'text-white hover-fine:hover:text-orange underline-offset-4 hover-fine:hover:underline',
  ghost:
    'font-bold uppercase tracking-display text-ghost',
};

export function AppLink({
  href,
  variant = 'inline',
  active,
  external,
  children,
  className,
}: AppLinkProps) {
  const classes = cn(
    variantClasses[variant],
    active && 'text-orange line-through',
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        aria-current={active ? 'page' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  );
}
