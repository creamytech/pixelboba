import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token?.role || !['ADMIN', 'OWNER'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // Portal routes protection
    if (pathname.startsWith('/portal')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to auth pages
        if (pathname.startsWith('/auth')) return true;

        // For protected routes, require a token
        if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) {
          return !!token;
        }

        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
