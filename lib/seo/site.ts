export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thepropagenda.com';
}

/**
 * Public studio inbox (mailto, footer, legal, JSON-LD) and form To fallback.
 * Override with NEXT_PUBLIC_CONTACT_EMAIL.
 */
export function getContactEmail() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    'contact@thepropagenda.com'
  );
}
