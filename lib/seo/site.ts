export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thepropagenda.com';
}

import { PUBLIC_CONTACT_EMAIL } from '@/lib/site/contact';

/**
 * Public studio inbox (mailto, footer, legal, JSON-LD) and form To fallback.
 * Env override for staging only — production uses the routing alias constant.
 */
export function getContactEmail() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || PUBLIC_CONTACT_EMAIL
  );
}
