import { Resend } from 'resend';
import type { ContactSchema } from './contactSchema';

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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildBodies(data: ContactSchema) {
  const lines = [
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Source: ${data.source}`,
    `Budget: ${data.budget}`,
    `Timeframe: ${data.timeframe}`,
    '',
    'Message:',
    data.message,
  ];
  const text = lines.join('\n');
  const html = `<pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`;
  return { text, html };
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

  const { text, html } = buildBodies(data);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: resolveFrom(),
    to: [to],
    replyTo: data.email,
    subject: `New brief — ${data.name} / ${data.company}`,
    text,
    html,
  });

  if (error) {
    console.error('[contact] Resend error', error);
    return { ok: false, message: 'Unable to send message. Please try again.' };
  }

  return { ok: true };
}
