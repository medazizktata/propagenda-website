import Link from 'next/link';
import { cn } from './cn';

interface LogoProps {
  variant?: 'horizontal' | 'mark';
  href?: string;
  className?: string;
}

export function Logo({ variant = 'horizontal', href = '/', className }: LogoProps) {
  const content =
    variant === 'mark' ? (
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange text-sm font-extrabold text-white"
      >
        P
      </span>
    ) : (
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-md bg-orange text-xs font-extrabold text-white md:h-9 md:w-9"
        >
          P
        </span>
        <span className="text-sm font-bold uppercase tracking-wider text-white md:text-base">
          Propagenda
        </span>
      </span>
    );

  return (
    <Link
      href={href}
      className={cn('inline-flex max-h-10 items-center md:max-h-10', className)}
      aria-label="Propagenda home"
    >
      {content}
    </Link>
  );
}
