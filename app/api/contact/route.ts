import { NextResponse } from 'next/server';
import { contactSchema, fieldErrorsFromZod } from '@/lib/forms/contactSchema';
import { sendContactEmail } from '@/lib/forms/sendContactEmail';
import { verifyTurnstileToken } from '@/lib/forms/verifyTurnstile';
import { contactCloser } from '@/content/contact';

/**
 * Contact-form transport (fetch — server action RSC remount blanked the page).
 * - malformed JSON → 400
 * - honeypot → fake success
 * - Turnstile siteverify when TURNSTILE_SECRET_KEY is set
 * - send throw → 502
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

  const record =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  if (String(record.website ?? '').trim() !== '') {
    return NextResponse.json({
      success: true,
      message: contactCloser.successMessage,
    });
  }

  const turnstile = await verifyTurnstileToken(
    record.turnstileToken,
    request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for'),
  );
  if (!turnstile.ok) {
    return NextResponse.json(
      { success: false, message: turnstile.message },
      { status: 403 },
    );
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

  return NextResponse.json({
    success: true,
    message: contactCloser.successMessage,
  });
}
