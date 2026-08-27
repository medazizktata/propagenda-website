import type { ContactSchema } from './contactSchema';
import { buildContactEmailBodies } from './contactEmailTemplate';
import { PUBLIC_CONTACT_EMAIL } from '@/lib/site/contact';

export type SendContactResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; message: string };

const DEFAULT_FROM = 'Propagenda <noreply@thepropagenda.com>';
const RESEND_API = 'https://api.resend.com/emails';
const FAIL_MESSAGE = 'Unable to send message. Please try again.';

function stripWrappingQuotes(value: string): string {
  const v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1).trim();
  }
  return v;
}

function env(name: string): string {
  const raw = process.env[name];
  return raw ? stripWrappingQuotes(raw) : '';
}

function resolveTo(): string | null {
  const to =
    env('CONTACT_TO_EMAIL') ||
    env('NEXT_PUBLIC_CONTACT_EMAIL') ||
    PUBLIC_CONTACT_EMAIL;
  return to || null;
}

function resolveFrom(): string {
  return env('CONTACT_FROM_EMAIL') || DEFAULT_FROM;
}

/**
 * Deliver a validated contact brief via Resend (raw fetch — Workers-safe).
 * No API key: soft-succeed outside production (UI/e2e DX); fail closed in production.
 */
export async function sendContactEmail(
  data: ContactSchema,
): Promise<SendContactResult> {
  const apiKey = env('RESEND_API_KEY');
  const to = resolveTo();
  const isProd = process.env.NODE_ENV === 'production';

  if (!apiKey) {
    if (isProd) {
      console.error('[contact] RESEND_API_KEY missing');
      return { ok: false, message: FAIL_MESSAGE };
    }
    return { ok: true, skipped: true };
  }

  // A RESEND_API_KEY in local .env must not turn every dev form-submit into a real
  // email — outside production, real sends require explicit CONTACT_SEND_ENABLED=1.
  if (!isProd && env('CONTACT_SEND_ENABLED') !== '1') {
    console.info('[contact] dev send skipped (set CONTACT_SEND_ENABLED=1 to send for real)');
    return { ok: true, skipped: true };
  }

  if (!to) {
    console.error('[contact] CONTACT_TO_EMAIL / NEXT_PUBLIC_CONTACT_EMAIL missing');
    return { ok: false, message: FAIL_MESSAGE };
  }

  const { text, html, subject } = buildContactEmailBodies(data);

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resolveFrom(),
        to: [to],
        reply_to: data.email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[contact] Resend HTTP error', res.status, body.slice(0, 500));
      return { ok: false, message: FAIL_MESSAGE };
    }

    return { ok: true };
  } catch (err) {
    console.error(
      '[contact] Resend fetch failed',
      err instanceof Error ? err.message : err,
    );
    return { ok: false, message: FAIL_MESSAGE };
  }
}
