import { Label, Input, Textarea } from '@/components/ui/FormFields';
import { cn } from '@/components/ui/cn';

interface FormFieldProps {
  id: string;
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  multiline?: boolean;
  defaultValue?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export function FormField({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  multiline,
  defaultValue,
  error,
  className,
  required,
}: FormFieldProps) {
  const invalid = Boolean(error);
  const describedBy = invalid ? `${id}-error` : undefined;

  return (
    <div className={cn('min-w-0', className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <>
            <span className="ml-1 text-orange" aria-hidden>
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn('max-w-full', invalid && 'border-error')}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(invalid && 'border-error')}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

