import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { reportType, dateRange, startDate, endDate, category, officerId } = body;

    let start: Date;
    let end: Date = new Date();

    // Calculate date range
    switch (dateRange) {
      case 'today':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start = new Date();
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'custom':
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      default:
        start = new Date();
        start.setMonth(start.getMonth() - 1);
    }

    let reportData: any = {};

    // Generate different report types
    switch (reportType) {
      case 'crime-statistics':
        reportData = await generateCrimeStatistics(start, end, category, req.user);
        break;
      case 'officer-performance':
        reportData = await generateOfficerPerformance(start, end, officerId, req.user);
        break;
      case 'traffic-offenses':
        reportData = await generateTrafficReport(start, end, req.user);
        break;
      case 'court-cases':
        reportData = await generateCourtReport(start, end, req.user);
        break;
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    const generatedBy = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        firstName: true,
        lastName: true,
        rank: true,
        serviceNumber: true,
      },
    });

    return NextResponse.json({
      dateRange: { start, end },
      generatedAt: new Date(),
      generatedBy: {
        name: `${generatedBy?.firstName || 'Unknown'} ${generatedBy?.lastName || 'User'}`,
        rank: generatedBy?.rank || 'Unknown',
        serviceNumber: generatedBy?.serviceNumber || 'Unknown',
      },
      data: reportData,
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

async function generateCrimeStatistics(start: Date, end: Date, category: string | undefined, user: any) {
  const where: any = {
    createdAt: {
      gte: start,
      lte: end,
    },
  };

  if (category) {
    where.category = category;
  }

  // Role-based filtering
  if (user.stationId) {
    where.stationId = user.stationId;
  } else if (user.countyId) {
    where.station = {
      countyId: user.countyId,
    };
  }

  const [totalCases, casesByCategory, casesByStatus, casesByPriority] = await Promise.all([
    prisma.case.count({ where }),
    prisma.case.groupBy({
      by: ['category'],
      where,
      _count: true,
    }),
    prisma.case.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.case.groupBy({
      by: ['priority'],
      where,
      _count: true,
    }),
  ]);

  const cases = await prisma.case.findMany({
    where,
    include: {
      station: { select: { name: true } },
      reportedBy: { select: { firstName: true, lastName: true, rank: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    summary: {
      totalCases,
      byCategory: casesByCategory,
      byStatus: casesByStatus,
      byPriority: casesByPriority,
    },
    cases,
  };
}

async function generateOfficerPerformance(start: Date, end: Date, officerId: string | undefined, user: any) {
  const where: any = {
    createdAt: {
      gte: start,
      lte: end,
    },
  };

  if (officerId) {
    where.reportedById = officerId;
  } else if (user.stationId) {
    where.reportedBy = {
      stationId: user.stationId,
    };
  }

  const officers = await prisma.user.findMany({
    where: {
      ...(user.stationId ? { stationId: user.stationId } : {}),
      ...(user.countyId && !user.stationId ? { countyId: user.countyId } : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      rank: true,
      serviceNumber: true,
      _count: {
        select: {
          casesReported: {
            where: {
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
          casesAssigned: {
            where: {
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
          trafficOffenses: {
            where: {
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      },
    },
  });

  return {
    officers: officers.map(officer => ({
      name: `${officer.rank} ${officer.firstName} ${officer.lastName}`,
      serviceNumber: officer.serviceNumber,
      casesReported: officer._count.casesReported,
      casesAssigned: officer._count.casesAssigned,
      trafficOffenses: officer._count.trafficOffenses,
      totalActivity: officer._count.casesReported + officer._count.casesAssigned + officer._count.trafficOffenses,
    })),
  };
}

async function generateTrafficReport(start: Date, end: Date, user: any) {
  const where: any = {
    createdAt: {
      gte: start,
      lte: end,
    },
  };

  if (user.stationId) {
    where.officer = {
      stationId: user.stationId,
    };
  }

  const [totalOffenses, offensesByType, paidUnpaid] = await Promise.all([
    prisma.trafficOffense.count({ where }),
    prisma.trafficOffense.groupBy({
      by: ['offenseType'],
      where,
      _count: true,
      _sum: {
        fineAmount: true,
      },
    }),
    prisma.trafficOffense.groupBy({
      by: ['isPaid'],
      where,
      _count: true,
      _sum: {
        fineAmount: true,
      },
    }),
  ]);

  const offenses = await prisma.trafficOffense.findMany({
    where,
    include: {
      officer: {
        select: {
          firstName: true,
          lastName: true,
          rank: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalFines = offenses.reduce((sum, o) => sum + (o.fineAmount || 0), 0);
  const totalPaid = offenses.filter(o => o.isPaid).reduce((sum, o) => sum + (o.fineAmount || 0), 0);

  return {
    summary: {
      totalOffenses,
      totalFines,
      totalPaid,
      totalUnpaid: totalFines - totalPaid,
      byType: offensesByType,
      paymentStatus: paidUnpaid,
    },
    offenses,
  };
}

async function generateCourtReport(start: Date, end: Date, user: any) {
  const where: any = {
    createdAt: {
      gte: start,
      lte: end,
    },
  };

  if (user.stationId) {
    where.case = {
      stationId: user.stationId,
    };
  }

  const [totalCases, casesByStatus] = await Promise.all([
    prisma.courtFile.count({ where }),
    prisma.courtFile.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
  ]);

  const courtFiles = await prisma.courtFile.findMany({
    where,
    include: {
      case: {
        select: {
          obNumber: true,
          title: true,
          category: true,
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
    orderBy: { createdAt: 'desc' },
  });

  return {
    summary: {
      totalCases,
      byStatus: casesByStatus,
    },
    courtFiles,
  };
}
