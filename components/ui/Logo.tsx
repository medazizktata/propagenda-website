import Link from 'next/link';
import { cn } from './cn';

type LogoLockup = 'mark' | 'horizontal' | 'vertical';

interface LogoProps {
  variant?: LogoLockup;
  href?: string;
  className?: string;
}

// Real Propagenda mark (orange rounded square + white "m" monogram) — the brand
// SVG the client provided (reference/Logo/SVG/Asset 6.svg → public/images/brand).
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

function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="text-sm font-bold lowercase tracking-tight text-white">Propagenda</span>
      <span className="mt-0.5 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-muted">
        Marketing Services
      </span>
    </span>
  );
}

export function Logo({ variant = 'horizontal', href = '/', className }: LogoProps) {
  let content;
  if (variant === 'mark') {
    content = <Mark className="h-9 w-9" />;
  } else if (variant === 'vertical') {
    content = (
      <span className="flex flex-col items-center gap-2 text-center">
        <Mark className="h-12 w-12" />
        <Wordmark />
      </span>
    );
  } else {
    content = (
      <span className="flex items-center gap-2.5">
        <Mark className="h-8 w-8 shrink-0" />
        <Wordmark />
      </span>
    );
  }

  return (
    <Link href={href} className={cn('inline-flex items-center', className)} aria-label="Propagenda home">
      {content}
    </Link>
  );
}
