import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const countyId = searchParams.get('countyId');

    const where: any = {};

    // Filter by county if specified
    if (countyId) {
      where.countyId = countyId;
    }

    // Role-based filtering
    if (req.user.role === 'COUNTY_COMMANDER' && req.user.countyId) {
      where.countyId = req.user.countyId;
    } else if (
      req.user.role !== 'INSPECTOR_GENERAL' &&
      req.user.role !== 'DEPUTY_INSPECTOR_GENERAL'
    ) {
      if (req.user.stationId) {
        where.id = req.user.stationId;
      }
    }

    const stations = await prisma.station.findMany({
      where,
      include: {
        county: {
          select: {
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            users: true,
            cases: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ stations });
  } catch (error) {
    console.error('Get stations error:', error);
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

    // Only IG and DIG can create stations
    if (
      req.user.role !== 'INSPECTOR_GENERAL' &&
      req.user.role !== 'DEPUTY_INSPECTOR_GENERAL'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, code, countyId, address, phoneNumber, latitude, longitude } = body;

    // Validate required fields
    if (!name || !code || !countyId || !address) {
      return NextResponse.json(
        { error: 'Name, code, county, and address are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await prisma.station.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Station code already exists' },
        { status: 400 }
      );
    }

    const station = await prisma.station.create({
      data: {
        name,
        code,
        countyId,
        address,
        phoneNumber: phoneNumber || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        isActive: true,
      },
      include: {
        county: true,
      },
    });

    return NextResponse.json(station, { status: 201 });
  } catch (error) {
    console.error('Create station error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
