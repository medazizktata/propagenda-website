import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  message: z.string().min(1, 'Message is required'),
});

export type ContactSchema = z.infer<typeof contactSchema>;
