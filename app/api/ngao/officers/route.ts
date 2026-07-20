import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withNgaoAuth, NgaoAuthenticatedRequest } from '@/lib/ngao-auth.proxy';

export const GET = withNgaoAuth(async (_req: NgaoAuthenticatedRequest) => {
  try {
    const officers = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rank: true,
        serviceNumber: true,
        station: { select: { name: true } },
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    return NextResponse.json({ officers });
  } catch (error) {
    console.error('NGAO officers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
