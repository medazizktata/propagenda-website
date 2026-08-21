'use server';

import type { ContactFormResult } from '@/types/forms';
import { contactSchema, fieldErrorsFromZod } from './contactSchema';
import { contactValuesFromFormData } from './contactValues';
import { sendContactEmail } from './sendContactEmail';
import { contactCloser } from '@/content/contact';

export async function submitContact(
  _prev: ContactFormResult,
  formData: FormData,
): Promise<ContactFormResult> {
  // Honeypot: humans never see or fill "website" (visually hidden, tabIndex -1).
  // Bots that do get a convincing fake success — no send, nothing to adapt to.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { success: true, message: contactCloser.successMessage };
  }

  const values = contactValuesFromFormData(formData);
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: '',
      fieldErrors: fieldErrorsFromZod(parsed.error),
      values,
    };
  }

  try {
    const sent = await sendContactEmail(parsed.data);
    if (!sent.ok) {
      return {
        success: false,
        message: sent.message,
        values: parsed.data,
      };
    }
  } catch (err) {
    console.error('[contact] submitContact threw', err);
    return {
      success: false,
      message: 'Unable to send message. Please try again.',
      values: parsed.data,
    };
  }

  return { success: true, message: contactCloser.successMessage };
}
