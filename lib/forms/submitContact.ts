'use server';

import type { ContactFormResult } from '@/types/forms';
import { contactSchema, fieldErrorsFromZod } from './contactSchema';
import { contactValuesFromFormData } from './contactValues';
import { sendContactEmail } from './sendContactEmail';

export async function submitContact(
  _prev: ContactFormResult,
  formData: FormData,
): Promise<ContactFormResult> {
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

  const sent = await sendContactEmail(parsed.data);
  if (!sent.ok) {
    return {
      success: false,
      message: sent.message,
      values: parsed.data,
    };
  }

  return { success: true, message: 'Thank you, we will be in touch shortly.' };
}
