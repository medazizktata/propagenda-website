import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import { legacyRedirects } from './lib/constants/redirects';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Required by @opennextjs/cloudflare (Workers bundle traces from .next/standalone).
  output: 'standalone',
  // Optional out-of-tree build dir so `next build` can run beside a live dev server
  // (both default to .next and corrupt each other). CI/audits: NEXT_DIST_DIR=.next-prod
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Tree-shake barrel imports — Next.js 16 recommended for icon/animation libs.
    optimizePackageImports: ['lucide-react', 'framer-motion', 'gsap'],
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default withBundleAnalyzer(nextConfig);

// Cloudflare Workers bindings during `next dev` (no-op in production builds).
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
