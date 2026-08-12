'use client';

import { useActionState, useEffect, useState, type FormEvent } from 'react';
import { submitContact } from '@/lib/forms/submitContact';
import { contactSchema, fieldErrorsFromZod } from '@/lib/forms/contactSchema';
import { contactValuesFromFormData } from '@/lib/forms/contactValues';
import type { ContactFieldErrors, ContactFormResult } from '@/types/forms';

const initialState: ContactFormResult = { success: false, message: '' };

/**
 * Server action + client Zod gate (same schema). Client errors show instantly;
 * server errors remain the source of truth after the round-trip.
 */
export function useContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});

  useEffect(() => {
    if (state.fieldErrors || state.success) setClientErrors({});
  }, [state]);

  const errors: ContactFieldErrors = {
    ...(state.fieldErrors ?? {}),
    ...clientErrors,
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const values = contactValuesFromFormData(new FormData(form));
    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      e.preventDefault();
      const next = fieldErrorsFromZod(parsed.error);
      setClientErrors(next);
      const first = Object.keys(next)[0];
      if (first) {
        requestAnimationFrame(() => {
          const el = form.querySelector<HTMLElement>(`#${CSS.escape(first)}`);
          el?.focus();
          el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      }
      return;
    }

    setClientErrors({});
  };

  return {
    state,
    formAction,
    pending,
    errors,
    values: state.values ?? {},
    onSubmit,
    /** Remount only after a server response so client validation never clears inputs. */
    formKey: `${state.success}:${JSON.stringify(state.values ?? null)}`,
  };
}
