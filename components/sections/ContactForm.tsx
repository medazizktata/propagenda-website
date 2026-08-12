'use client';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/molecules/FormField';
import { FormSelect } from '@/components/molecules/FormSelect';
import { contactCloser } from '@/content/contact';
import { useContactForm } from '@/hooks/useContactForm';

/** Legacy standalone form — mirrors ContactCloser field set. */
export function ContactForm() {
  const { state, formAction, pending, errors, values, onSubmit, formKey } = useContactForm();
  const f = contactCloser.fields;

  return (
    <div className="max-w-form-min w-full">
      <form
        key={formKey}
        action={formAction}
        onSubmit={onSubmit}
        className="w-full max-w-full space-y-4"
        noValidate
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="name"
            name="name"
            label={f.name.label}
            placeholder={f.name.placeholder}
            defaultValue={values.name}
            error={errors.name}
            required
          />
          <FormField
            id="company"
            name="company"
            label={f.company.label}
            placeholder={f.company.placeholder}
            defaultValue={values.company}
            error={errors.company}
            required
          />
        </div>
        <FormField
          id="email"
          name="email"
          type="email"
          label={f.email.label}
          placeholder={f.email.placeholder}
          defaultValue={values.email}
          error={errors.email}
          required
        />
        <FormSelect
          id="source"
          name="source"
          label={f.source.label}
          placeholder={f.source.placeholder}
          options={f.source.options}
          defaultValue={values.source}
          error={errors.source}
          required
        />
        <div className="grid items-end gap-4 md:grid-cols-2">
          <FormSelect
            id="budget"
            name="budget"
            label={f.budget.label}
            placeholder={f.budget.placeholder}
            options={f.budget.options}
            defaultValue={values.budget}
            error={errors.budget}
            required
          />
          <FormSelect
            id="timeframe"
            name="timeframe"
            label={f.timeframe.label}
            placeholder={f.timeframe.placeholder}
            options={f.timeframe.options}
            defaultValue={values.timeframe}
            error={errors.timeframe}
            required
          />
        </div>
        <FormField
          id="message"
          name="message"
          label={f.message.label}
          placeholder={f.message.placeholder}
          multiline
          className="max-w-full"
          defaultValue={values.message}
          error={errors.message}
          required
        />
        <div className="flex justify-end">
          <Button type="submit" loading={pending}>
            {contactCloser.submitLabel}
          </Button>
        </div>
        {state.message ? (
          <p className={state.success ? 'text-success' : 'text-error'} role="status">
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
