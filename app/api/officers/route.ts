import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import bcrypt from 'bcryptjs';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const stationId = searchParams.get('stationId');
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');

    let where: any = {};

    // Role-based filtering
    if (req.user.role === 'OCS' || req.user.role === 'OCPD') {
      where.stationId = req.user.stationId;
    } else if (req.user.role === 'COUNTY_COMMANDER') {
      where.countyId = req.user.countyId;
    }

    // Additional filters
    if (stationId) where.stationId = stationId;
    if (role) where.role = role;
    if (isActive) where.isActive = isActive === 'true';

    const officers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        serviceNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        rank: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        station: {
          select: {
            name: true,
            code: true,
          },
        },
        county: {
          select: {
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            casesReported: true,
            casesAssigned: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ officers });
  } catch (error) {
    console.error('Get officers error:', error);
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

    // Only IG, DIG, and OCS can create officers
    const allowedRoles = ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS', 'COUNTY_COMMANDER'];
    if (!allowedRoles.includes(req.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      serviceNumber,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
      rank,
      stationId,
      countyId,
    } = body;

    // Validate required fields
    if (!serviceNumber || !email || !password || !firstName || !lastName || !phoneNumber || !role || !rank) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if service number or email already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { serviceNumber },
          { email },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Service number or email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await prisma.user.create({
      data: {
        serviceNumber,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role,
        rank,
        stationId: stationId || null,
        countyId: countyId || null,
        isActive: true,
      },
      select: {
        id: true,
        serviceNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        rank: true,
        isActive: true,
        station: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(officer, { status: 201 });
  } catch (error) {
    console.error('Create officer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
