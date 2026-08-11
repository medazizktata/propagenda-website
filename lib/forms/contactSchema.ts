import { z } from 'zod';
import { contactCloser } from '@/content/contact';

const sourceOptions = contactCloser.fields.source.options as [string, ...string[]];
const budgetOptions = contactCloser.fields.budget.options as [string, ...string[]];
const timeframeOptions = contactCloser.fields.timeframe.options as [string, ...string[]];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(120, 'Name is too long'),
  company: z
    .string()
    .trim()
    .min(1, 'Company is required')
    .max(120, 'Company is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  source: z.enum(sourceOptions, { message: 'Please select an option' }),
  budget: z.enum(budgetOptions, { message: 'Please select a budget' }),
  timeframe: z.enum(timeframeOptions, { message: 'Please select a time frame' }),
  message: z
    .string()
    .trim()
    .min(1, 'Tell us about the project')
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
});

export type ContactSchema = z.infer<typeof contactSchema>;

export function fieldErrorsFromZod(
  error: z.ZodError,
): Partial<Record<keyof ContactSchema, string>> {
  const flat = error.flatten().fieldErrors as Partial<
    Record<keyof ContactSchema, string[]>
  >;
  const out: Partial<Record<keyof ContactSchema, string>> = {};
  for (const key of Object.keys(flat) as (keyof ContactSchema)[]) {
    const msg = flat[key]?.[0];
    if (msg) out[key] = msg;
  }
  return out;
}
