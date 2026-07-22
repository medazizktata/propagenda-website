import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isFeatureUnlocked } from '@/lib/featureFlags';
import { SOFT_LAUNCH_QUERY } from '@/lib/softLaunch';

/**
 * Hard lock: any unfinished route never reaches the page — edge redirect to home.
 * Server layouts + client guard reinforce this for RSC / soft navigations.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isFeatureUnlocked(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  url.searchParams.set(SOFT_LAUNCH_QUERY, '1');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * All app routes except Next internals and files with extensions
     * (images, fonts, robots.txt handled as static where applicable).
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
