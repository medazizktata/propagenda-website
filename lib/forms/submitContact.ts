'use server';

import type { ContactFormResult } from '@/types/forms';
import { contactSchema } from './contactSchema';

export async function submitContact(formData: FormData): Promise<ContactFormResult> {
  const parsed = contactSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid form data',
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
      return { success: false, message: 'Unable to send message. Please try again.' };
    }
  }

  return { success: true, message: 'Thank you — we will be in touch shortly.' };
}
