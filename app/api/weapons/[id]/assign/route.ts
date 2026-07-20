import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { WeaponStatus } from '@/generated/prisma/enums';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const allowedRoles = ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS', 'OCPD', 'OCP', 'INSPECTOR'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { officerId, purpose, notes } = await req.json();

    if (!officerId) {
      return NextResponse.json({ error: 'officerId is required' }, { status: 400 });
    }

    const weapon = await prisma.weapon.findUnique({ where: { id } });
    if (!weapon) return NextResponse.json({ error: 'Weapon not found' }, { status: 404 });

    if (weapon.status === WeaponStatus.ASSIGNED) {
      return NextResponse.json({ error: 'Weapon is already assigned. Return it first.' }, { status: 400 });
    }

    if (weapon.status !== WeaponStatus.IN_ARMORY) {
      return NextResponse.json({ error: `Cannot assign weapon with status: ${weapon.status}` }, { status: 400 });
    }

    const [assignment] = await prisma.$transaction([
      prisma.weaponAssignment.create({
        data: {
          weaponId: id,
          officerId,
          assignedById: user.userId,
          purpose: purpose || null,
          notes: notes || null,
          isReturned: false,
        },
        include: {
          officer: { select: { firstName: true, lastName: true, rank: true, serviceNumber: true } },
          weapon: { select: { serialNumber: true, weaponType: true, make: true } },
        },
      }),
      prisma.weapon.update({
        where: { id },
        data: { status: WeaponStatus.ASSIGNED },
      }),
    ]);

    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        action: 'WEAPON_ASSIGNED',
        entityType: 'Weapon',
        entityId: id,
        metadata: { officerId, serialNumber: weapon.serialNumber },
      },
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    console.error('Assign weapon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
