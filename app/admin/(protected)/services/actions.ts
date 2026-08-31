'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/cms/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function deleteServices(ids: string[]) {
  await requireAdminSession();

  if (ids.length === 0) return { ok: true as const };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('services').delete().in('id', ids);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath('/admin/services');
  revalidatePath('/services');
  return { ok: true as const };
}
