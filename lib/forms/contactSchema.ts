import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(80, 'First name is too long'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(80, 'Last name is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required')
    .min(7, 'Enter a valid phone number')
    .max(30, 'Phone number is too long'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
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
