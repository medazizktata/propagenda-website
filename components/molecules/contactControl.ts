import { cn } from '@/components/ui/cn';

/** Shared shell — inputs, selects, and textarea must look like one family. */
export const contactControl = cn(
  'box-border w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.05] px-5',
  'text-base text-white placeholder:text-white/35',
  'transition-[border-color,background-color,box-shadow] duration-200',
  'hover-fine:hover:border-white/20 hover-fine:hover:bg-white/[0.07]',
  'focus-visible:border-orange/70 focus-visible:bg-white/[0.08] focus-visible:outline-none',
  'focus-visible:shadow-[0_0_0_3px_rgba(245,139,39,0.18)]',
);

export const contactControlSingle = cn(contactControl, 'h-14 leading-none');

export const contactLabel =
  'mb-2.5 block min-h-5 text-sm font-medium leading-5 tracking-normal text-white/60';
