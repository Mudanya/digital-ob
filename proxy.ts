import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';
import { verifyNgaoToken } from './lib/ngao-auth';

const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/public/',
  '/api/ngao/auth/',
];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only intercept API routes
  if (!pathname.startsWith('/api')) return NextResponse.next();

  // Allow public API routes through without auth
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies.get('accessToken')?.value;

  if (!token) {
    return Response.json({ success: false, message: 'Authentication required' }, { status: 401 });
  }

  // Try police officer token
  const policeUser = verifyToken(token);
  if (policeUser) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', policeUser.userId);
    requestHeaders.set('x-user-email', policeUser.email);
    requestHeaders.set('x-user-role', policeUser.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Try NGAO token for NGAO-specific routes
  if (pathname.startsWith('/api/ngao/')) {
    const ngaoUser = verifyNgaoToken(token);
    if (ngaoUser) return NextResponse.next();
  }

  return Response.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
}

export const config = {
  matcher: '/api/:path*',
};
