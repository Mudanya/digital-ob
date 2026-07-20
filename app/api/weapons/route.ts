import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';
import { WeaponType, WeaponStatus, WeaponCondition } from '@/generated/prisma/enums';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const weaponType = searchParams.get('weaponType');
    const stationId = searchParams.get('stationId');

    const where: any = {};

    // Station-level officers see only their station's weapons
    if (req.user.role === 'OCS' || req.user.role === 'OCPD' || req.user.role === 'OCP' ||
        req.user.role === 'INSPECTOR' || req.user.role === 'SERGEANT' ||
        req.user.role === 'CORPORAL' || req.user.role === 'CONSTABLE') {
      where.stationId = req.user.stationId;
    } else if (stationId) {
      where.stationId = stationId;
    }

    if (status) where.status = status;
    if (weaponType) where.weaponType = weaponType;

    const weapons = await prisma.weapon.findMany({
      where,
      include: {
        station: { select: { id: true, name: true, code: true } },
        assignments: {
          where: { isReturned: false },
          include: {
            officer: { select: { id: true, firstName: true, lastName: true, rank: true, serviceNumber: true } },
          },
          orderBy: { assignedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ weapons });
  } catch (error) {
    console.error('Get weapons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const allowedRoles = ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS', 'OCPD'];
    if (!allowedRoles.includes(req.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { serialNumber, weaponType, make, model, caliber, condition, dateAcquired, notes, stationId } = body;

    if (!serialNumber || !weaponType || !make) {
      return NextResponse.json({ error: 'serialNumber, weaponType, and make are required' }, { status: 400 });
    }

    const existing = await prisma.weapon.findUnique({ where: { serialNumber } });
    if (existing) {
      return NextResponse.json({ error: 'Serial number already registered' }, { status: 400 });
    }

    const resolvedStationId = stationId || req.user.stationId;
    if (!resolvedStationId) {
      return NextResponse.json({ error: 'Station ID is required' }, { status: 400 });
    }

    const weapon = await prisma.weapon.create({
      data: {
        stationId: resolvedStationId,
        serialNumber,
        weaponType: weaponType as WeaponType,
        make,
        model: model || null,
        caliber: caliber || null,
        condition: (condition as WeaponCondition) || WeaponCondition.SERVICEABLE,
        status: WeaponStatus.IN_ARMORY,
        dateAcquired: dateAcquired ? new Date(dateAcquired) : null,
        notes: notes || null,
      },
      include: { station: { select: { name: true, code: true } } },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'WEAPON_REGISTERED',
        entityType: 'Weapon',
        entityId: weapon.id,
        metadata: { serialNumber, weaponType },
      },
    });

    return NextResponse.json(weapon, { status: 201 });
  } catch (error) {
    console.error('Create weapon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
