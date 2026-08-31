import type { SupabaseClient } from '@supabase/supabase-js';

export interface SeedAdminUserOptions {
  email: string;
  password: string;
}

export function resolveDefaultAdminCredentials(): SeedAdminUserOptions {
  const email = (process.env.CMS_DEFAULT_ADMIN_EMAIL ?? 'admin@thepropagenda.com').trim().toLowerCase();
  const password = process.env.CMS_DEFAULT_ADMIN_PASSWORD?.trim();

  if (!password) {
    throw new Error(
      'Set CMS_DEFAULT_ADMIN_PASSWORD before seeding (see .env.example).',
    );
  }

  if (password.length < 12) {
    throw new Error('CMS_DEFAULT_ADMIN_PASSWORD must be at least 12 characters.');
  }

  return { email, password };
}

export async function seedDefaultAdminUser(
  supabase: SupabaseClient,
  { email, password }: SeedAdminUserOptions,
): Promise<'created' | 'updated'> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'cms_admin' },
  });

  if (!error) {
    return 'created';
  }

  const alreadyExists = error.message.toLowerCase().includes('already');
  if (!alreadyExists) {
    throw new Error(`admin user: ${error.message}`);
  }

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    throw new Error(`admin user lookup: ${listError.message}`);
  }

  const existing = listData.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!existing) {
    throw new Error(`admin user exists but could not be found: ${email}`);
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
    user_metadata: { role: 'cms_admin' },
  });

  if (updateError) {
    throw new Error(`admin user update: ${updateError.message}`);
  }

  return 'updated';
}
