'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/molecules/FormField';
import { contactForm } from '@/content/site';
import { submitContact } from '@/lib/forms/submitContact';
import type { ContactFormResult } from '@/types/forms';

const initialState: ContactFormResult = { success: false, message: '' };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <div className="max-w-form-min w-full">
      {/* key remounts fields with fresh defaultValues after each validation round-trip */}
      <form
        key={JSON.stringify(errors) + String(state.success)}
        action={formAction}
        className="w-full max-w-full space-y-4"
        noValidate
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="firstName"
            name="firstName"
            label={contactForm.fields.firstName.label}
            placeholder={contactForm.fields.firstName.placeholder}
            defaultValue={values.firstName}
            error={errors.firstName}
            required
          />
          <FormField
            id="lastName"
            name="lastName"
            label={contactForm.fields.lastName.label}
            placeholder={contactForm.fields.lastName.placeholder}
            defaultValue={values.lastName}
            error={errors.lastName}
            required
          />
        </div>
        <FormField
          id="email"
          name="email"
          type="email"
          label={contactForm.fields.email.label}
          placeholder={contactForm.fields.email.placeholder}
          defaultValue={values.email}
          error={errors.email}
          required
        />
        <FormField
          id="phone"
          name="phone"
          type="tel"
          label={contactForm.fields.phone.label}
          placeholder={contactForm.fields.phone.placeholder}
          defaultValue={values.phone}
          error={errors.phone}
          required
        />
        <FormField
          id="message"
          name="message"
          label={contactForm.fields.message.label}
          placeholder={contactForm.fields.message.placeholder}
          multiline
          className="max-w-full"
          defaultValue={values.message}
          error={errors.message}
          required
        />
        <div className="flex justify-end">
          <Button type="submit" loading={pending}>
            {contactForm.submitLabel}
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
