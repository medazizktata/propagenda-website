import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, Poppins } from 'next/font/google';
import { Providers } from './providers';
import { SkipLink } from '@/components/ui/SkipLink';
import { SiteShell } from '@/components/layout/SiteShell';
import { getSiteUrl } from '@/lib/seo/site';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

/** Backstage register (design DNA §2.3): mono caps for eyebrows, section numbers,
    deliverable-label columns, metadata, scroll cues. 400 for meta, 500 for labels. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#121212',
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: 'Propagenda',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${plexMono.variable}`}>
      <body>
        <SkipLink />
        <Providers>
          <SiteShell>
            <main id="main-content">{children}</main>
          </SiteShell>
        </Providers>
      </body>
    </html>
  );
}
