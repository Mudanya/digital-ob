import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { WeaponCondition, WeaponStatus } from '@/generated/prisma/enums';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const weapon = await prisma.weapon.findUnique({
      where: { id },
      include: {
        station: { select: { id: true, name: true, code: true } },
        assignments: {
          include: {
            officer: { select: { id: true, firstName: true, lastName: true, rank: true, serviceNumber: true } },
            assignedBy: { select: { id: true, firstName: true, lastName: true, rank: true } },
          },
          orderBy: { assignedAt: 'desc' },
        },
      },
    });

    if (!weapon) return NextResponse.json({ error: 'Weapon not found' }, { status: 404 });

    return NextResponse.json({ weapon });
  } catch (error) {
    console.error('Get weapon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const allowedRoles = ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS', 'OCPD'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const weapon = await prisma.weapon.update({
      where: { id },
      data: {
        condition: body.condition as WeaponCondition | undefined,
        status: body.status as WeaponStatus | undefined,
        notes: body.notes,
      },
    });

    return NextResponse.json({ weapon });
  } catch (error) {
    console.error('Update weapon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
