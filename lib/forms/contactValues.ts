import type { ContactFormData } from '@/types/forms';

/** Shared FormData → values mapper for client + server Zod parses. */
export function contactValuesFromFormData(formData: FormData): ContactFormData {
  return {
    name: String(formData.get('name') ?? ''),
    company: String(formData.get('company') ?? ''),
    email: String(formData.get('email') ?? ''),
    source: String(formData.get('source') ?? ''),
    budget: String(formData.get('budget') ?? ''),
    timeframe: String(formData.get('timeframe') ?? ''),
    message: String(formData.get('message') ?? ''),
  };
}
