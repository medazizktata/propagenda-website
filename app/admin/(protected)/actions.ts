'use server';

import { redirect } from 'next/navigation';

/** Cloudflare Access owns the session now (TASK-11.4) -- its own logout
    endpoint clears the CF_Authorization cookie and ends the Access session. */
export async function signOut() {
  redirect('/cdn-cgi/access/logout');
}
