import type { Redirect } from 'next/dist/lib/load-custom-routes';

function redirect(source: string, destination: string): Redirect[] {
  return [
    { source, destination, permanent: true },
    { source: `${source}/`, destination, permanent: true },
  ];
}

export const legacyRedirects: Redirect[] = [
  ...redirect('/about-us', '/about'),
  ...redirect('/contact-us', '/contact'),
  ...redirect('/portfolio', '/work'),
  ...redirect('/portfolios', '/work'),
  ...redirect('/branding-visual-identity', '/services/branding-visual-identity'),
  ...redirect('/public-relations', '/services/public-relations'),
  ...redirect('/online-offline-marketing', '/services/online-offline-marketing'),
  ...redirect('/graphics-production', '/services/graphics-production'),
  ...redirect('/websites', '/services/websites'),
  ...redirect('/mobile-applications', '/services/mobile-applications'),
  ...redirect('/events', '/services/events'),
  ...redirect('/photography-videography', '/services/photography-videography'),
  ...redirect('/portfolio/sanapex-interiors', '/work/sanapex-interiors'),
  ...redirect('/portfolio/p2p-motors', '/work/p2p-motors'),
  ...redirect('/portfolio/dose-pharmacy', '/work/dose-pharmacy'),
  ...redirect('/portfolio/clemson-porter-properties', '/work/clemson-porter-properties'),
  ...redirect('/portfolio/emirates-agro', '/work/emirates-agro'),
  ...redirect('/portfolio/zealerz', '/work/zealerz'),
  ...redirect(
    '/2025/01/02/the-art-of-branding-crafting-a-memorable-identity',
    '/blog/the-power-of-visual-identity',
  ),
  ...redirect(
    '/2025/01/02/typography-tips-for-effective-visual-communication',
    '/blog/whats-destroying-your-brand',
  ),
  ...redirect(
    '/2025/01/02/how-to-create-impactful-social-media-graphics',
    '/blog/how-colors-influence-consumer-behavior',
  ),
  ...redirect('/category/branding', '/blog'),
  ...redirect('/category/websites', '/blog'),
  ...redirect('/tag/branding', '/blog'),
  ...redirect('/tag/creative', '/blog'),
  ...redirect('/tag/innovative', '/blog'),
];
