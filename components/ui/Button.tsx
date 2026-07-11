import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'primary-ghost' | 'secondary' | 'invert' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-orange text-white hover:bg-orange-hover hover-fine:hover:bg-orange-hover uppercase font-bold',
  'primary-ghost':
    'border border-border-accent text-orange bg-transparent uppercase font-bold hover-fine:hover:bg-orange/10',
  secondary: 'bg-black text-white uppercase font-bold',
  invert: 'bg-black text-orange uppercase font-bold hover-fine:hover:text-white',
  text: 'bg-transparent text-white uppercase font-bold hover-fine:hover:text-orange',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs min-h-11',
  md: 'px-6 py-3 text-sm min-h-11',
  lg: 'px-8 py-3 text-base min-h-11',
  xl: 'px-10 py-4 text-lg min-h-12',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  loading,
  disabled,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-pill transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-busy={loading}>
        {loading ? <Spinner /> : children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
