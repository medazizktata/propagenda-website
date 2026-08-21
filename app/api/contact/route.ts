import { NextResponse } from 'next/server';
import { contactSchema, fieldErrorsFromZod } from '@/lib/forms/contactSchema';
import { sendContactEmail } from '@/lib/forms/sendContactEmail';
import { contactCloser } from '@/content/contact';

/**
 * Contact-form transport (the form posts here via fetch — a server action caused an
 * RSC refresh that remounted the page). Hardening:
 * - malformed JSON → 400 (never a 500 with a misleading "unable to send")
 * - same friendly per-field error shape as the schema (no raw Zod internals as the
 *   only signal; `message` stays the first human message)
 * - honeypot: a filled "website" field gets a convincing fake success — no send
 * - sendContactEmail throw → 502 generic
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid form data' },
      { status: 400 },
    );
  }

  const website =
    typeof body === 'object' && body !== null && 'website' in body
      ? String((body as Record<string, unknown>).website ?? '')
      : '';
  if (website.trim() !== '') {
    return NextResponse.json({ success: true, message: contactCloser.successMessage });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromZod(parsed.error);
    return NextResponse.json(
      {
        success: false,
        message: Object.values(fieldErrors)[0] ?? 'Invalid form data',
        fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const sent = await sendContactEmail(parsed.data);
    if (!sent.ok) {
      return NextResponse.json(
        { success: false, message: sent.message },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error('[contact] route send threw', err);
    return NextResponse.json(
      { success: false, message: 'Unable to send message. Please try again.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, message: contactCloser.successMessage });
}
