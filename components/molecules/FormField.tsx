import { Label, Input, Textarea } from '@/components/ui/FormFields';

interface FormFieldProps {
  id: string;
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  multiline?: boolean;
  defaultValue?: string;
  error?: string;
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
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea id={id} name={name} placeholder={placeholder} defaultValue={defaultValue} />
      ) : (
        <Input id={id} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} />
      )}
      {error ? <p className="mt-1 text-sm text-error">{error}</p> : null}
    </div>
  );
}
