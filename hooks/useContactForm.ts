'use client';

import { useRef, useState, type FormEvent } from 'react';
import { contactSchema, fieldErrorsFromZod } from '@/lib/forms/contactSchema';
import { contactValuesFromFormData } from '@/lib/forms/contactValues';
import type { ContactFieldErrors, ContactFormData, ContactFormResult } from '@/types/forms';
import type { TurnstileFieldHandle } from '@/components/molecules/TurnstileField';

const initialState: ContactFormResult = { success: false, message: '' };

/**
 * Client Zod + POST /api/contact.
 * Avoids Next server-action RSC refresh remounting the page (blank GSAP / image gates).
 */
export function useContactForm() {
  const [state, setState] = useState<ContactFormResult>(initialState);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const [pending, setPending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileFieldHandle>(null);

  const errors: ContactFieldErrors = {
    ...(state.fieldErrors ?? {}),
    ...clientErrors,
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = contactValuesFromFormData(new FormData(form));
    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      const next = fieldErrorsFromZod(parsed.error);
      setClientErrors(next);
      setState({ success: false, message: '', values, fieldErrors: next });
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

    if (!turnstileToken) {
      setState({
        success: false,
        message: 'Complete the security check above before sending.',
        values: parsed.data,
      });
      return;
    }

    setClientErrors({});
    setPending(true);
    setState({ success: false, message: '', values: parsed.data });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          website: String(new FormData(form).get('website') ?? ''),
          turnstileToken: turnstileToken ?? '',
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        fieldErrors?: ContactFieldErrors;
      } | null;

      if (!res.ok || !data?.success) {
        setState({
          success: false,
          message: data?.message || 'Unable to send message. Please try again.',
          fieldErrors: data?.fieldErrors,
          values: parsed.data,
        });
        return;
      }

      setState({
        success: true,
        message: data.message || 'Thank you, we will be in touch shortly.',
      });
      form.reset();
    } catch {
      setState({
        success: false,
        message: 'Unable to send message. Please try again.',
        values: parsed.data,
      });
    } finally {
      setPending(false);
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  };

  return {
    state,
    pending,
    errors,
    values: (state.values ?? {}) as Partial<ContactFormData>,
    onSubmit,
    turnstileRef,
    setTurnstileToken,
    /** Remount selects after success so placeholders return; keep values on error. */
    formKey: state.success ? `ok-${state.message}` : 'edit',
  };
}
