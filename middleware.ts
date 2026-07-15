import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRouteUnlocked, SOFT_LAUNCH_QUERY } from '@/lib/softLaunch';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isRouteUnlocked(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.searchParams.set(SOFT_LAUNCH_QUERY, '1');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Skip Next internals + static files with extensions.
     * Soft-launch unlock list handles /api etc. for the rest.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
