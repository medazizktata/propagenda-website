import { createClient } from '@supabase/supabase-js';
import { buildContentSeedRows } from '@/lib/cms/seedData';
import { resolveDefaultAdminCredentials, seedDefaultAdminUser } from '@/lib/cms/seedAdminUser';

// Unlike `next dev`, a standalone tsx script doesn't auto-load .env files.
// Load .env then .env.local (later call wins) so this works the same as the
// app does, without requiring the vars to already be exported in the shell.
for (const file of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Missing file is fine (e.g. no .env.local in CI) — a real parse error
    // will still surface below via the presence check.
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function upsertTable<T extends Record<string, unknown>>(
  table: 'services' | 'case_studies' | 'video_projects',
  rows: T[],
) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'slug,locale' });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function main() {
  const adminCredentials = resolveDefaultAdminCredentials();
  const adminResult = await seedDefaultAdminUser(supabase, adminCredentials);
  console.log(
    `${adminResult === 'created' ? 'Created' : 'Updated'} CMS admin: ${adminCredentials.email}`,
  );

  const { services, caseStudies, videos } = buildContentSeedRows();

  await upsertTable('services', services);
  await upsertTable('case_studies', caseStudies);
  await upsertTable('video_projects', videos);

  console.log(
    `Seeded ${services.length} services, ${caseStudies.length} case studies, ${videos.length} videos.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
