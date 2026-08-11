'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/molecules/FormField';
import { contactCloser } from '@/content/contact';
import { submitContact } from '@/lib/forms/submitContact';
import type { ContactFormResult } from '@/types/forms';

const initialState: ContactFormResult = { success: false, message: '' };

/** Legacy standalone form — mirrors ContactCloser field set. */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const f = contactCloser.fields;

  return (
    <div className="max-w-form-min w-full">
      <form
        key={JSON.stringify(errors) + String(state.success)}
        action={formAction}
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
        <label className="block text-sm text-white/70">
          {f.source.label}
          <select
            name="source"
            defaultValue={values.source ?? ''}
            required
            className="mt-1.5 w-full rounded-md border border-white/15 bg-transparent px-3 py-2"
          >
            <option value="" disabled>
              {f.source.placeholder}
            </option>
            {f.source.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.source ? <p className="mt-1 text-sm text-error">{errors.source}</p> : null}
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-white/70">
            {f.budget.label}
            <select
              name="budget"
              defaultValue={values.budget ?? ''}
              required
              className="mt-1.5 w-full rounded-md border border-white/15 bg-transparent px-3 py-2"
            >
              <option value="" disabled>
                {f.budget.placeholder}
              </option>
              {f.budget.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.budget ? <p className="mt-1 text-sm text-error">{errors.budget}</p> : null}
          </label>
          <label className="block text-sm text-white/70">
            {f.timeframe.label}
            <select
              name="timeframe"
              defaultValue={values.timeframe ?? ''}
              required
              className="mt-1.5 w-full rounded-md border border-white/15 bg-transparent px-3 py-2"
            >
              <option value="" disabled>
                {f.timeframe.placeholder}
              </option>
              {f.timeframe.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.timeframe ? (
              <p className="mt-1 text-sm text-error">{errors.timeframe}</p>
            ) : null}
          </label>
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
