import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public endpoint — no auth required
// Returns limited case info by OB number and logs the lookup
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const obNumber = searchParams.get('obNumber')?.trim();

    if (!obNumber) {
      return NextResponse.json({ error: 'obNumber query parameter is required' }, { status: 400 });
    }

    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Log the lookup for audit (fire and forget — don't await to keep response fast)
    prisma.publicLookupLog.create({
      data: { obNumber, ipAddress },
    }).catch(() => {});

    const caseRecord = await prisma.case.findUnique({
      where: { obNumber },
      select: {
        obNumber: true,
        title: true,
        category: true,
        status: true,
        priority: true,
        location: true,
        incidentDate: true,
        createdAt: true,
        station: { select: { name: true, phoneNumber: true } },
        caseUpdates: {
          select: { updateType: true, description: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!caseRecord) {
      return NextResponse.json(
        { error: 'No case found with that OB number. Please verify the number and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ case: caseRecord });
  } catch (error) {
    console.error('Public case lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
