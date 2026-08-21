/**
 * Cloudflare Turnstile siteverify — fail closed.
 * Secret: TURNSTILE_SECRET_KEY (Worker secret only — never commit).
 * Site key: NEXT_PUBLIC_TURNSTILE_SITE_KEY (public; set in wrangler vars / CF Builds env).
 */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const ACTION = 'contact';

/** Public widget site key from env (inlined into client at build time). */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';

function allowedHostnames(): Set<string> {
  const fromEnv = (process.env.TURNSTILE_HOSTNAMES ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);
  if (fromEnv.length) return new Set(fromEnv);
  return new Set(['thepropagenda.com', 'www.thepropagenda.com']);
}

export type TurnstileCheck =
  | { ok: true }
  | { ok: false; message: string };

export async function verifyTurnstileToken(
  token: unknown,
  remoteip?: string | null,
): Promise<TurnstileCheck> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.error('[contact] TURNSTILE_SECRET_KEY missing');
    return { ok: false, message: 'Unable to verify submission. Please try again.' };
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { ok: false, message: 'Please complete the verification challenge.' };
  }

  const hosts = allowedHostnames();
  if (hosts.size === 0) {
    return { ok: false, message: 'Unable to verify submission. Please try again.' };
  }

  let result: {
    success?: boolean;
    action?: string;
    hostname?: string;
  };
  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    if (remoteip) body.set('remoteip', remoteip.split(',')[0]!.trim());

    const res = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    result = (await res.json()) as typeof result;
  } catch (err) {
    console.error('[contact] Turnstile siteverify failed', err);
    return { ok: false, message: 'Unable to verify submission. Please try again.' };
  }

  if (
    result.success !== true ||
    result.action !== ACTION ||
    !result.hostname ||
    !hosts.has(result.hostname)
  ) {
    return { ok: false, message: 'Please complete the verification challenge.' };
  }

  return { ok: true };
}

export const TURNSTILE_ACTION = ACTION;
