'use client';

import { cn } from '@/components/ui/cn';

interface HamburgerButtonProps {
  open: boolean;
  onClick: () => void;
}

export function HamburgerButton({ open, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      className="relative z-20 flex h-9 w-9 flex-col items-center justify-center gap-1 lg:hidden"
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      onClick={onClick}
    >
      <span
        className={cn(
          'h-0.5 w-5 origin-center bg-white transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]',
          open && 'translate-y-[6px] rotate-45',
        )}
      />
      <span
        className={cn(
          'h-0.5 w-5 bg-white transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]',
          open && 'scale-x-0 opacity-0',
        )}
      />
      <span
        className={cn(
          'h-0.5 w-5 origin-center bg-white transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]',
          open && '-translate-y-[6px] -rotate-45',
        )}
      />
    </button>
  );
}
