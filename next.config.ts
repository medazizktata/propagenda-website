import type { NextConfig } from 'next';
import { legacyRedirects } from './lib/constants/redirects';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
