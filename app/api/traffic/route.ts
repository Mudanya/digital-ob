import { NextResponse } from 'next/server';
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

    let where: any = {};

    // Role-based filtering - filter by officer's station
    if (req.user.stationId) {
      where.officer = {
        stationId: req.user.stationId,
      };
    } else if (req.user.countyId) {
      where.officer = {
        station: {
          countyId: req.user.countyId,
        },
      };
    }

    const [offenses, total] = await Promise.all([
      prisma.trafficOffense.findMany({
        where,
        include: {
          officer: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
              serviceNumber: true,
              station: {
                select: {
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.trafficOffense.count({ where }),
    ]);

    return NextResponse.json({
      offenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get traffic offenses error:', error);
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

    const body = await req.json();
    const {
      driverName,
      driverIdNumber,
      driverLicense,
      vehicleReg,
      offenseType,
      location,
      fineAmount,
      latitude,
      longitude,
    } = body;

    // Validate required fields
    if (!driverName || !vehicleReg || !offenseType || !location) {
      return NextResponse.json(
        { error: 'Driver name, vehicle registration, offense type, and location are required' },
        { status: 400 }
      );
    }

    // Generate unique offense number
    const count = await prisma.trafficOffense.count();
    const offenseNumber = `TO-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    const offense = await prisma.trafficOffense.create({
      data: {
        offenseNumber,
        driverName,
        driverIdNumber: driverIdNumber || null,
        driverLicense: driverLicense || null,
        vehicleReg: vehicleReg.toUpperCase(),
        offenseType,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        fineAmount: fineAmount ? parseFloat(fineAmount) : null,
        isPaid: false,
        offenseDate: new Date(),
        officerId: req.user.userId,
      },
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
            station: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(offense, { status: 201 });
  } catch (error) {
    console.error('Create traffic offense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
