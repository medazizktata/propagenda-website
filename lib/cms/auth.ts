import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/** Header Cloudflare Access injects on every request that already passed its
    policy for this route (see TASK-11.4) -- enforcement happens at Cloudflare's
    edge, before the request ever reaches this Worker. Reading it here is
    defense-in-depth / for display, not the access-control decision itself. */
const ACCESS_EMAIL_HEADER = 'cf-access-authenticated-user-email';

export function getAdminEmails(): string[] {
  const raw = process.env.CMS_ADMIN_EMAILS ?? '';
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;

  const allowed = getAdminEmails();
  if (allowed.length === 0) {
    return process.env.NODE_ENV !== 'production';
  }

  return allowed.includes(email.toLowerCase());
}

/** The identity Cloudflare Access already authenticated for this request.
    In production the header is always present -- Access rejects the request
    at the edge before it reaches this Worker otherwise. Outside production
    (no Access in front of `next dev`), fall back to the first configured
    admin email so local admin-dashboard work doesn't require standing up
    Access for dev too; this mirrors isAdminEmail's existing dev bypass. */
export async function getAccessIdentity(): Promise<{ email: string } | null> {
  const headerList = await headers();
  const email = headerList.get(ACCESS_EMAIL_HEADER);
  if (email) return { email };

  if (process.env.NODE_ENV !== 'production') {
    const [devEmail] = getAdminEmails();
    return { email: devEmail ?? 'dev@localhost' };
  }

  return null;
}

/** Defense-in-depth check for Server Actions under /admin: Access already
    blocked this request at the edge if it didn't pass the app's policy, so
    this should always resolve -- but assert it explicitly rather than trust
    that silently, and fail closed if the header is ever missing or the email
    isn't on the allowlist. */
export async function requireAdminIdentity(): Promise<{ email: string }> {
  const identity = await getAccessIdentity();
  if (!identity || !isAdminEmail(identity.email)) {
    redirect('/');
  }
  return identity;
}
