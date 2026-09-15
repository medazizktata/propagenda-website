import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isFeatureUnlocked } from '@/lib/featureFlags';
import { SOFT_LAUNCH_QUERY } from '@/lib/softLaunch';

/**
 * Hard lock: unfinished / work-locked routes never reach the page — edge redirect
 * to home. OpenNext Cloudflare still requires Edge Middleware (middleware.ts);
 * Next 16's proxy.ts (Node) is not supported yet.
 *
 * /admin is gated by Cloudflare Access at Cloudflare's own edge network (see
 * TASK-11.4) -- an unauthenticated request never reaches this middleware at
 * all, so there's nothing for it to do for that path.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

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
