import { NextRequest, NextResponse } from 'next/server';

// Routes that require a logged-in Firebase session
const PROTECTED_PAGE_PREFIXES = ['/app', '/editor'];

// API routes that require an admin session (handled server-side, but we block plain GETs)
const ADMIN_API_PREFIX = '/api/admin';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ------------------------------------------------------------------
  // Protect authenticated pages: /app and /editor
  // We check for the Firebase auth session cookie set by the client SDK.
  // Firebase client SDK stores the current user serialised in IndexedDB,
  // but it also writes a "firebase:authUser:..." cookie in some setups.
  // For a reliable server-side check we look for a custom session cookie
  // that the app's sign-in page can set (see SignInPage).
  // Fallback: if NO session cookie is present, redirect to /sign-in.
  // ------------------------------------------------------------------
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isProtectedPage) {
    const sessionCookie =
      req.cookies.get('__session')?.value ||
      req.cookies.get('firebase-session')?.value;

    // Allow requests that already carry a session or a Bearer token header
    const authHeader = req.headers.get('authorization');
    const hasAuth = Boolean(sessionCookie || authHeader);

    if (!hasAuth) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/sign-in';
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ------------------------------------------------------------------
  // Admin API routes — must have Authorization header
  // This is a lightweight guard; true auth happens inside each route handler.
  // ------------------------------------------------------------------
  if (pathname.startsWith(ADMIN_API_PREFIX)) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing authorization header.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run proxy on these paths only (skip static files and _next internals)
  matcher: [
    '/app/:path*',
    '/editor/:path*',
    '/api/admin/:path*',
  ],
};
