import Link from 'next/link';

interface ArrowCTAProps {
  label: string;
  href: string;
  showArrows?: boolean;
}

export function ArrowCTA({ label, href, showArrows = true }: ArrowCTAProps) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex flex-col items-center gap-2 font-bold uppercase tracking-wide text-orange transition-colors duration-fast hover-fine:hover:text-white"
    >
      {showArrows && (
        <span aria-hidden className="flex flex-col text-orange leading-none">
          <span>↓</span>
          <span>↓</span>
          <span>↓</span>
        </span>
      )}
      <span>{label}</span>
    </Link>
  );
}
