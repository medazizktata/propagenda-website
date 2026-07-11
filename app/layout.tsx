import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: 'Propagenda',
  themeColor: '#252525',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
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
