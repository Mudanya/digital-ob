import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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

    const chargeSheet = await prisma.chargeSheet.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            obNumber: true,
            title: true,
            incidentDate: true,
            station: { select: { name: true, code: true, phoneNumber: true } },
          },
        },
        createdBy: { select: { firstName: true, lastName: true, rank: true, serviceNumber: true } },
      },
    });

    if (!chargeSheet) return NextResponse.json({ error: 'Charge sheet not found' }, { status: 404 });

    return NextResponse.json({ chargeSheet });
  } catch (error) {
    console.error('Get charge sheet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const chargeSheet = await prisma.chargeSheet.update({
      where: { id },
      data: {
        ...body,
        dateOfArrest: body.dateOfArrest ? new Date(body.dateOfArrest) : null,
        dateApprehensionReport: body.dateApprehensionReport ? new Date(body.dateApprehensionReport) : null,
        dateDrafted: body.dateDrafted ? new Date(body.dateDrafted) : undefined,
      },
    });

    return NextResponse.json({ chargeSheet });
  } catch (error) {
    console.error('Update charge sheet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
