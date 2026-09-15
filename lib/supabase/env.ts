const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseUrl(): string {
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  return url;
}

export function getSupabaseServiceRoleKey(): string {
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return serviceRoleKey;
}

/** Admin CRUD (services table) still lives in Supabase Postgres, accessed only
    via the service-role client (see lib/supabase/admin.ts) -- Cloudflare
    Access gates who can reach it, not Supabase Auth/RLS (TASK-11.4). Public
    content reads come from D1, not this. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && serviceRoleKey);
}
