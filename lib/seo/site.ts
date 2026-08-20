export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thepropagenda.com';
}

/**
 * Public studio inbox (mailto, footer, legal, JSON-LD).
 * Override with NEXT_PUBLIC_CONTACT_EMAIL — currently Gmail until info@ is fully live.
 */
export function getContactEmail() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    'propagendamarketing@gmail.com'
  );
}
