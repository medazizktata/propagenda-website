import { Resend } from 'resend';
import type { ContactSchema } from './contactSchema';
import { buildContactEmailBodies } from './contactEmailTemplate';

export type SendContactResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; message: string };

const DEFAULT_FROM = 'Propagenda <onboarding@resend.dev>';

function resolveTo(): string | null {
  const to =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    '';
  return to || null;
}

function resolveFrom(): string {
  return process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

/**
 * Deliver a validated contact brief via Resend.
 * No API key: soft-succeed outside production (UI/e2e DX); fail closed in production.
 */
export async function sendContactEmail(
  data: ContactSchema,
): Promise<SendContactResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = resolveTo();
  const isProd = process.env.NODE_ENV === 'production';

  if (!apiKey) {
    if (isProd) {
      return { ok: false, message: 'Unable to send message. Please try again.' };
    }
    return { ok: true, skipped: true };
  }

  if (!to) {
    return { ok: false, message: 'Unable to send message. Please try again.' };
  }

  const { text, html, subject } = buildContactEmailBodies(data);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: resolveFrom(),
    to: [to],
    replyTo: data.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error('[contact] Resend error', error);
    return { ok: false, message: 'Unable to send message. Please try again.' };
  }

  return { ok: true };
}
