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
    const { notes } = await req.json();

    const weapon = await prisma.weapon.findUnique({ where: { id } });
    if (!weapon) return NextResponse.json({ error: 'Weapon not found' }, { status: 404 });

    if (weapon.status !== WeaponStatus.ASSIGNED) {
      return NextResponse.json({ error: 'Weapon is not currently assigned' }, { status: 400 });
    }

    const activeAssignment = await prisma.weaponAssignment.findFirst({
      where: { weaponId: id, isReturned: false },
    });

    if (!activeAssignment) {
      return NextResponse.json({ error: 'No active assignment found' }, { status: 404 });
    }

    const [assignment] = await prisma.$transaction([
      prisma.weaponAssignment.update({
        where: { id: activeAssignment.id },
        data: {
          isReturned: true,
          returnedAt: new Date(),
          returnedToId: user.userId,
          notes: notes || activeAssignment.notes,
        },
        include: {
          officer: { select: { firstName: true, lastName: true, serviceNumber: true } },
        },
      }),
      prisma.weapon.update({
        where: { id },
        data: { status: WeaponStatus.IN_ARMORY },
      }),
    ]);

    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        action: 'WEAPON_RETURNED',
        entityType: 'Weapon',
        entityId: id,
        metadata: { serialNumber: weapon.serialNumber },
      },
    });

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error('Return weapon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
