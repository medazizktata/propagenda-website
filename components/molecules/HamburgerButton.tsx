'use client';

interface HamburgerButtonProps {
  open: boolean;
  onClick: () => void;
}

export function HamburgerButton({ open, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      onClick={onClick}
    >
      <span className={`h-0.5 w-6 bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
      <span className={`h-0.5 w-6 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
      <span className={`h-0.5 w-6 bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
    </button>
  );
}
