'use client';

import { useActionState } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/molecules/FormField';
import { contactForm } from '@/content/site';
import { submitContact } from '@/lib/forms/submitContact';

const initialState = { success: false, message: '' };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => submitContact(formData),
    initialState,
  );

  return (
    <div className="max-w-form-min">
      <DisplayHeading as="h2" size="display-xs" className="mb-2">
        {contactForm.heading}
      </DisplayHeading>
      <BodyText muted className="mb-8">
        {contactForm.subheading}
      </BodyText>
      <form action={formAction} className="space-y-4" noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="firstName"
            name="firstName"
            label={contactForm.fields.firstName.label}
            placeholder={contactForm.fields.firstName.placeholder}
          />
          <FormField
            id="lastName"
            name="lastName"
            label={contactForm.fields.lastName.label}
            placeholder={contactForm.fields.lastName.placeholder}
          />
        </div>
        <FormField
          id="email"
          name="email"
          type="email"
          label={contactForm.fields.email.label}
          placeholder={contactForm.fields.email.placeholder}
        />
        <FormField
          id="phone"
          name="phone"
          type="tel"
          label={contactForm.fields.phone.label}
          placeholder={contactForm.fields.phone.placeholder}
        />
        <FormField
          id="message"
          name="message"
          label={contactForm.fields.message.label}
          placeholder={contactForm.fields.message.placeholder}
          multiline
        />
        <Button type="submit" loading={pending} className="w-full md:w-auto">
          {contactForm.submitLabel}
        </Button>
        {state.message ? (
          <p className={state.success ? 'text-success' : 'text-error'} role="status">
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
