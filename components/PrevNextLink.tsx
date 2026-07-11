import Link from 'next/link';

interface PrevNextLinkProps {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}

export function PrevNextLink({ prev, next }: PrevNextLinkProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Case study navigation"
      className="flex flex-wrap items-center justify-between gap-6 border-t border-border px-gutter-m py-12 font-bold uppercase tracking-wide lg:px-gutter-d"
    >
      {prev ? (
        <Link href={prev.href} className="hover-fine:hover:text-orange">
          ← {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className="ml-auto hover-fine:hover:text-orange">
          {next.label} →
        </Link>
      )}
    </nav>
  );
}
