import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

export function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn('mb-2 block text-sm font-medium text-white', className)}>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-11 w-full max-w-full rounded-lg border border-border bg-black/55 px-4 py-3 text-base text-white placeholder:text-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-32 max-h-64 w-full max-w-full resize-y rounded-lg border border-border bg-black/55 px-4 py-3 text-base text-white placeholder:text-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
        className,
      )}
      {...props}
    />
  );
}
