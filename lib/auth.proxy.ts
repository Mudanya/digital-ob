import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from '@/lib/auth';
import { UserRole } from '@/generated/prisma/enums';


export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: AuthenticatedRequest) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' },
          { status: 401 }
        );
      }

      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        );
      }

      req.user = user;
      return handler(req);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function withRole(roles: UserRole[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (!roles.includes(req.user.role)) {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(req);
    });
  };
}