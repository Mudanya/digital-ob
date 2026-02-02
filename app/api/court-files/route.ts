import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const caseId = searchParams.get('caseId');

    let where: any = {};

    // Filter by status
    if (status) where.status = status;
    if (caseId) where.caseId = caseId;

    // Role-based filtering
    if (req.user.stationId) {
      where.case = {
        stationId: req.user.stationId,
      };
    }

    const courtFiles = await prisma.courtFile.findMany({
      where,
      include: {
        case: {
          select: {
            obNumber: true,
            title: true,
            category: true,
            station: {
              select: {
                name: true,
              },
            },
          },
        },
        filedBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
            serviceNumber: true,
          },
        },
      },
      orderBy: { filingDate: 'desc' },
    });

    return NextResponse.json({ courtFiles });
  } catch (error) {
    console.error('Get court files error:', error);
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
    const { caseId, courtName, caseNumber, filingDate, hearingDate, notes } = body;

    // Validate required fields
    if (!caseId || !courtName || !caseNumber || !filingDate) {
      return NextResponse.json(
        { error: 'Case, court name, case number, and filing date are required' },
        { status: 400 }
      );
    }

    // Check if case number already exists
    const existing = await prisma.courtFile.findUnique({
      where: { caseNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Case number already exists' },
        { status: 400 }
      );
    }

    const courtFile = await prisma.courtFile.create({
      data: {
        caseId,
        courtName,
        caseNumber,
        filedById: req.user.userId,
        filingDate: new Date(filingDate),
        hearingDate: hearingDate ? new Date(hearingDate) : null,
        notes: notes || null,
        status: 'FILED',
      },
      include: {
        case: {
          select: {
            obNumber: true,
            title: true,
          },
        },
        filedBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
      },
    });

    return NextResponse.json(courtFile, { status: 201 });
  } catch (error) {
    console.error('Create court file error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
