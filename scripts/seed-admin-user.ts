import { createClient } from '@supabase/supabase-js';
import { resolveDefaultAdminCredentials, seedDefaultAdminUser } from '@/lib/cms/seedAdminUser';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const credentials = resolveDefaultAdminCredentials();
  const result = await seedDefaultAdminUser(supabase, credentials);

  console.log(
    `${result === 'created' ? 'Created' : 'Updated'} CMS admin: ${credentials.email}`,
  );
  console.log('Ensure this email is listed in CMS_ADMIN_EMAILS for /admin access.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
