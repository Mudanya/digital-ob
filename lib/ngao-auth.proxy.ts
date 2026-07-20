import { NextRequest, NextResponse } from 'next/server';
import { verifyNgaoToken, NgaoTokenPayload } from '@/lib/ngao-auth';

export interface NgaoAuthenticatedRequest extends NextRequest {
  ngaoUser?: NgaoTokenPayload;
}

export function withNgaoAuth(
  handler: (req: NgaoAuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NgaoAuthenticatedRequest) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
      }

      const ngaoUser = verifyNgaoToken(token);

      if (!ngaoUser) {
        return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
      }

      req.ngaoUser = ngaoUser;
      return handler(req);
    } catch (error) {
      console.error('NGAO auth middleware error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
