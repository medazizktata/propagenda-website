import { cn } from '@/components/ui/cn';

/** Shared shell — inputs, selects, and textarea must look like one family.
 *  Fields sit lighter than the form card so controls read as distinct wells. */
export const contactControl = cn(
  'box-border w-full min-w-0 rounded-2xl border border-white/18 bg-white/[0.09] px-5',
  'text-base text-white placeholder:text-white/45',
  'transition-[border-color,background-color,box-shadow] duration-200',
  'hover-fine:hover:border-white/28 hover-fine:hover:bg-white/[0.12]',
  'focus-visible:border-orange/80 focus-visible:bg-white/[0.12] focus-visible:outline-none',
  'focus-visible:shadow-[0_0_0_3px_rgba(245,139,39,0.22)]',
);

export const contactControlSingle = cn(contactControl, 'h-14 leading-none');

export const contactLabel =
  'mb-2.5 block min-h-5 text-sm font-medium leading-5 tracking-normal text-white/75';
