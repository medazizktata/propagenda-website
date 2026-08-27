export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thepropagenda.com';
}

import { PUBLIC_CONTACT_EMAIL } from '@/lib/site/contact';

/**
 * Public studio inbox (mailto, footer, legal, JSON-LD).
 * Always the routing alias — do not read NEXT_PUBLIC_* here (build inlines stale values).
 */
export function getContactEmail() {
  return PUBLIC_CONTACT_EMAIL;
}
