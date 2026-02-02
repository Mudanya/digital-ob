import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const stationId = searchParams.get('stationId');
    const officerId = searchParams.get('officerId');

    let where: any = {};

    // Role-based filtering
    if (req.user.role === 'OCS' || req.user.role === 'OCPD') {
      where.stationId = req.user.stationId;
    } else if (req.user.role === 'CONSTABLE') {
      where.officerId = req.user.userId;
    }

    // Additional filters
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      where.dutyDate = {
        gte: targetDate,
        lt: nextDay,
      };
    }
    if (stationId) where.stationId = stationId;
    if (officerId) where.officerId = officerId;

    const rosters = await prisma.dutyRoster.findMany({
      where,
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
            serviceNumber: true,
          },
        },
        station: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: { dutyDate: 'desc' },
    });

    return NextResponse.json({ rosters });
  } catch (error) {
    console.error('Get duty rosters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only OCS, OCPD, and above can create rosters
    const allowedRoles = ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'COUNTY_COMMANDER', 'OCPD', 'OCS'];
    if (!allowedRoles.includes(req.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { officerId, stationId, dutyDate, shiftStart, shiftEnd, status, assignment, notes } = body;

    // Validate required fields
    if (!officerId || !stationId || !dutyDate || !shiftStart || !shiftEnd) {
      return NextResponse.json(
        { error: 'Officer, station, date, and shift times are required' },
        { status: 400 }
      );
    }

    const roster = await prisma.dutyRoster.create({
      data: {
        officerId,
        stationId,
        dutyDate: new Date(dutyDate),
        shiftStart: new Date(shiftStart),
        shiftEnd: new Date(shiftEnd),
        status: status || 'ON_DUTY',
        assignment: assignment || null,
        notes: notes || null,
      },
      include: {
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
    });

    return NextResponse.json(roster, { status: 201 });
  } catch (error) {
    console.error('Create duty roster error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
