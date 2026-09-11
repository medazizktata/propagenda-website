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

/** Monogram + Propagenda wordmark (no tagline). */
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
      alt="Propagenda"
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
      <Lockup src="/images/brand/logo-vertical-wordmark.svg" className="h-16 w-auto" />
    );
  } else {
    // A step smaller on the narrowest screens. The lockup is 3.54:1, so at h-9 it is ~127px
    // wide — which at 360 leaves exactly nothing between it and the header's call to action.
    // h-8 buys back 14px there without changing which lockup is shown.
    content = (
      <Lockup
        src="/images/brand/logo-horizontal-wordmark.svg"
        className="h-8 w-auto sm:h-9"
      />
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
