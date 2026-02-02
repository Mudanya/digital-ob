import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const counties = await prisma.county.findMany({
      include: {
        _count: {
          select: {
            stations: true,
            users: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Get stats for each county
    const countiesWithStats = await Promise.all(
      counties.map(async (county) => {
        const activeCases = await prisma.case.count({
          where: {
            station: {
              countyId: county.id,
            },
            status: {
              in: ['REPORTED', 'UNDER_INVESTIGATION'],
            },
          },
        });

        return {
          ...county,
          activeCases,
        };
      })
    );

    return NextResponse.json({ counties: countiesWithStats });
  } catch (error) {
    console.error('Get counties error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
