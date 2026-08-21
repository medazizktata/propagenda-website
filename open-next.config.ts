import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * CF Builds runs `pnpm build` then `wrangler deploy`.
 * OpenNext must own `build`, but it invokes the package `build` script by default —
 * set buildCommand to plain `next build` to avoid recursion.
 */
const config = defineCloudflareConfig({});

export default {
  ...config,
  buildCommand: 'next build',
};
