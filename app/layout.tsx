import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { SkipLink } from '@/components/ui/SkipLink';
import { SiteShell } from '@/components/layout/SiteShell';
import { getSiteUrl } from '@/lib/seo/site';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-KS0FKS0NTF';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
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
    <html lang="en" className={poppins.variable}>
      <body>
        {/* gtag.js (~170 KB, plus its follow-up requests to google-analytics/doubleclick) loads
            after window load so it never competes with first paint. The inline init below still
            runs early: it only queues into dataLayer, and gtag replays the queue (including the
            page_view from `config`) when it arrives. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <SkipLink />
        <Providers>
          <SiteShell>
            <div id="main-content" role="main" className="min-h-dvh">
              {children}
            </div>
          </SiteShell>
        </Providers>
      </body>
    </html>
  );
}
