import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No R2 incremental cache yet — static + ISR still work; add an R2 binding later
// (NEXT_INC_CACHE_R2_BUCKET) if you want durable Next.js cache on Workers.
export default defineCloudflareConfig({});
