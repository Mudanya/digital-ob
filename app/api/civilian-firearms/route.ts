import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';
import { WeaponType } from '@/generated/prisma/enums';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    const where: any = {};

    if (req.user.role === 'OCS' || req.user.role === 'OCPD' || req.user.role === 'OCP' ||
        req.user.role === 'INSPECTOR' || req.user.role === 'SERGEANT' ||
        req.user.role === 'CORPORAL' || req.user.role === 'CONSTABLE') {
      where.stationId = req.user.stationId;
    }

    if (isActive !== null && isActive !== undefined) where.isActive = isActive === 'true';

    if (search) {
      where.OR = [
        { ownerName: { contains: search, mode: 'insensitive' } },
        { ownerIdNumber: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const firearms = await prisma.civilianFirearm.findMany({
      where,
      include: { station: { select: { name: true, code: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ firearms });
  } catch (error) {
    console.error('Get civilian firearms error:', error);
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
    const {
      ownerName, ownerIdNumber, ownerPhone, ownerAddress,
      serialNumber, weaponType, make, model, caliber,
      licenseNumber, licenseIssuedAt, licenseExpiresAt, stationId, notes,
    } = body;

    if (!ownerName || !ownerIdNumber || !serialNumber || !weaponType || !make || !licenseNumber || !licenseIssuedAt || !licenseExpiresAt) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const existing = await prisma.civilianFirearm.findFirst({
      where: { OR: [{ serialNumber }, { licenseNumber }] },
    });
    if (existing) {
      return NextResponse.json({ error: 'Serial number or license number already registered' }, { status: 400 });
    }

    const firearm = await prisma.civilianFirearm.create({
      data: {
        ownerName, ownerIdNumber,
        ownerPhone: ownerPhone || null,
        ownerAddress: ownerAddress || null,
        serialNumber,
        weaponType: weaponType as WeaponType,
        make,
        model: model || null,
        caliber: caliber || null,
        licenseNumber,
        licenseIssuedAt: new Date(licenseIssuedAt),
        licenseExpiresAt: new Date(licenseExpiresAt),
        stationId: stationId || req.user.stationId || '',
        notes: notes || null,
      },
      include: { station: { select: { name: true, code: true } } },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'CIVILIAN_FIREARM_REGISTERED',
        entityType: 'CivilianFirearm',
        entityId: firearm.id,
        metadata: { licenseNumber, ownerName },
      },
    });

    return NextResponse.json(firearm, { status: 201 });
  } catch (error) {
    console.error('Create civilian firearm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
