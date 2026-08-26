import Link from 'next/link';
import { cn } from './cn';

type LogoLockup = 'mark' | 'horizontal' | 'vertical';

interface LogoProps {
  variant?: LogoLockup;
  href?: string;
  className?: string;
}

/** App-icon mark (orange squircle + white monogram) — compact header / favicon. */
function Mark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/brand/logo-mark.svg"
      alt="Propagenda"
      className={cn('h-9 w-9 select-none', className)}
      draggable={false}
    />
  );
}

/** Official lockup from brand PDF (monogram + Propagenda + Marketing Services). */
function Lockup({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Propagenda Marketing Services"
      className={cn('h-9 w-auto select-none', className)}
      draggable={false}
    />
  );
}

export function Logo({ variant = 'horizontal', href = '/', className }: LogoProps) {
  let content;
  if (variant === 'mark') {
    content = <Mark className="h-9 w-9" />;
  } else if (variant === 'vertical') {
    content = (
      <Lockup src="/images/brand/logo-vertical.svg" className="h-16 w-auto" />
    );
  } else {
    content = (
      <Lockup src="/images/brand/logo-horizontal.svg" className="h-9 w-auto" />
    );
  }

  // WCAG 2.5.3: image alt already names the brand; link gets "home" via sr-only.
  return (
    <Link href={href} className={cn('inline-flex items-center', className)}>
      {content}
      <span className="sr-only">, home</span>
    </Link>
  );
}
