import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withNgaoAuth, NgaoAuthenticatedRequest } from '@/lib/ngao-auth.proxy';

export const GET = withNgaoAuth(async (req: NgaoAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const countyId = searchParams.get('countyId');

    const stations = await prisma.station.findMany({
      where: countyId ? { countyId } : undefined,
      select: {
        id: true,
        name: true,
        code: true,
        county: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ stations });
  } catch (error) {
    console.error('NGAO stations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
