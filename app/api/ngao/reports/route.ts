import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withNgaoAuth, NgaoAuthenticatedRequest } from '@/lib/ngao-auth.proxy';
import { CaseCategory, CasePriority, NgaoCommunityReportStatus } from '@/generated/prisma/enums';

export const GET = withNgaoAuth(async (req: NgaoAuthenticatedRequest) => {
  try {
    if (!req.ngaoUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};

    // Chiefs/Sub-Chiefs see only their own reports; commissioners see all under their scope
    const seniorRoles = ['COUNTY_COMMISSIONER', 'SUB_COUNTY_COMMISSIONER'];
    if (!seniorRoles.includes(req.ngaoUser.role)) {
      where.reportedById = req.ngaoUser.ngaoId;
    } else if (req.ngaoUser.subCountyId) {
      where.reportedBy = {
        OR: [
          { subCountyId: req.ngaoUser.subCountyId },
          { location: { subCountyId: req.ngaoUser.subCountyId } },
        ],
      };
    }

    if (status) where.status = status as NgaoCommunityReportStatus;

    const reports = await prisma.ngaoCommunityReport.findMany({
      where,
      include: {
        reportedBy: { select: { id: true, name: true, role: true, serviceId: true } },
        referredToStation: { select: { id: true, name: true, code: true, phoneNumber: true } },
        relatedCase: { select: { id: true, obNumber: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get NGAO reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withNgaoAuth(async (req: NgaoAuthenticatedRequest) => {
  try {
    if (!req.ngaoUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, description, category, priority, location, latitude, longitude, referredToStationId, notes } = body;

    if (!title || !description || !category || !priority || !location) {
      return NextResponse.json({ error: 'title, description, category, priority, and location are required' }, { status: 400 });
    }

    const report = await prisma.ngaoCommunityReport.create({
      data: {
        reportedById: req.ngaoUser.ngaoId,
        title,
        description,
        category: category as CaseCategory,
        priority: priority as CasePriority,
        location,
        latitude: latitude || null,
        longitude: longitude || null,
        referredToStationId: referredToStationId || null,
        notes: notes || null,
        status: referredToStationId ? NgaoCommunityReportStatus.REFERRED_TO_POLICE : NgaoCommunityReportStatus.SUBMITTED,
      },
      include: {
        reportedBy: { select: { name: true, role: true } },
        referredToStation: { select: { name: true, code: true } },
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error('Create NGAO report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
