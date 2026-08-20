'use client';

import { cn } from '@/components/ui/cn';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { contactControlSingle, contactLabel } from './contactControl';

export function FormSelect({
  id,
  name,
  label,
  placeholder,
  options,
  defaultValue,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: readonly string[];
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  const items = [
    { label: placeholder, value: null },
    ...options.map((opt) => ({ label: opt, value: opt })),
  ];

  return (
    <div className="flex w-full min-w-0 flex-col">
      <label htmlFor={id} className={contactLabel}>
        {label}
        {required ? <span className="ml-1 text-orange">*</span> : null}
      </label>
      <Select
        name={name}
        items={items}
        defaultValue={defaultValue || null}
        required={required}
      >
        <SelectTrigger
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            contactControlSingle,
            'flex !w-full min-w-0 max-w-full items-center justify-between gap-3 text-left',
            'rounded-2xl pr-5 pl-5 data-[size=default]:h-14 data-[size=default]:rounded-2xl',
            'data-placeholder:text-white/45',
            '[&_svg]:text-white/50',
            error && 'border-error',
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} side="bottom">
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <p
        id={error ? `${id}-error` : undefined}
        className={cn(
          'mt-1.5 min-h-4 text-xs leading-4',
          error ? 'text-error' : 'invisible',
        )}
        role={error ? 'alert' : undefined}
      >
        {error || '\u00a0'}
      </p>
    </div>
  );
}
