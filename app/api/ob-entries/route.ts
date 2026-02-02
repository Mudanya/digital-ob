import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause based on user role
    let where: any = {};

    if (
      req.user.role !== 'INSPECTOR_GENERAL' &&
      req.user.role !== 'DEPUTY_INSPECTOR_GENERAL'
    ) {
      if (req.user.role === 'COUNTY_COMMANDER' && req.user.countyId) {
        where.station = {
          countyId: req.user.countyId,
        };
      } else if (req.user.stationId) {
        where.stationId = req.user.stationId;
      }
    }

    const [entries, total] = await Promise.all([
      prisma.oBEntry.findMany({
        where,
        include: {
          case: {
            select: {
              id: true,
              obNumber: true,
              title: true,
              category: true,
              status: true,
              priority: true,
            },
          },
          officer: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
            },
          },
          station: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { entryDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.oBEntry.count({ where }),
    ]);

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get OB entries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
