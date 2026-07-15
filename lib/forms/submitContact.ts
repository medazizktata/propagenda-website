'use server';

import type { ContactFormData, ContactFormResult } from '@/types/forms';
import { contactSchema, fieldErrorsFromZod } from './contactSchema';

function readFields(formData: FormData): ContactFormData {
  return {
    firstName: String(formData.get('firstName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    message: String(formData.get('message') ?? ''),
  };
}

export async function submitContact(
  _prev: ContactFormResult,
  formData: FormData,
): Promise<ContactFormResult> {
  const values = readFields(formData);
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: '',
      fieldErrors: fieldErrorsFromZod(parsed.error),
      values,
    };
  }

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CONTACT_FORM_API_KEY
          ? { Authorization: `Bearer ${process.env.CONTACT_FORM_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Unable to send message. Please try again.',
        values: parsed.data,
      };
    }
  }

  return { success: true, message: 'Thank you — we will be in touch shortly.' };
}
