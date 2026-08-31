import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminEmail } from '@/lib/cms/auth';
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '@/lib/supabase/env';

const LOGIN_PATH = '/admin/login';

function redirectToLogin(request: NextRequest, error?: string) {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = '';
  if (error) url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}

export async function handleAdminAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === LOGIN_PATH;
  const isAuthCallback = pathname.startsWith('/auth/');

  if (!isSupabaseConfigured()) {
    if (isLoginRoute || isAuthCallback) return NextResponse.next();
    if (pathname.startsWith('/admin')) return redirectToLogin(request, 'config');
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthCallback) {
    return response;
  }

  if (user && !isAdminEmail(user.email)) {
    await supabase.auth.signOut();
    if (isLoginRoute) {
      return redirectToLogin(request, 'forbidden');
    }
    return redirectToLogin(request, 'forbidden');
  }

  if (!user && pathname.startsWith('/admin') && !isLoginRoute) {
    return redirectToLogin(request);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
