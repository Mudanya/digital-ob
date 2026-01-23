import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build where clause based on user role
    let stationWhere: any = {};
    let caseWhere: any = {};

    if (
      req.user.role !== 'INSPECTOR_GENERAL' &&
      req.user.role !== 'DEPUTY_INSPECTOR_GENERAL'
    ) {
      if (req.user.role === 'COUNTY_COMMANDER' && req.user.countyId) {
        // County commander sees all stations in their county
        stationWhere = { countyId: req.user.countyId };
        caseWhere = {
          station: {
            countyId: req.user.countyId,
          },
        };
      } else if (req.user.stationId) {
        // Other roles see only their station
        stationWhere = { id: req.user.stationId };
        caseWhere = { stationId: req.user.stationId };
      }
    }

    // Get statistics
    const [
      totalCases,
      pendingCases,
      urgentCases,
      resolvedCases,
      activeOfficers,
      courtCases,
      recentCases,
      recentActivity,
      monthlyStats,
    ] = await Promise.all([
      // Total cases
      prisma.case.count({ where: caseWhere }),

      // Pending cases
      prisma.case.count({
        where: {
          ...caseWhere,
          status: {
            in: ['REPORTED', 'UNDER_INVESTIGATION'],
          },
        },
      }),

      // Urgent cases
      prisma.case.count({
        where: {
          ...caseWhere,
          priority: 'URGENT',
          status: {
            not: 'RESOLVED',
          },
        },
      }),

      // Resolved cases
      prisma.case.count({
        where: {
          ...caseWhere,
          status: 'RESOLVED',
        },
      }),

      // Active officers
      prisma.user.count({
        where: {
          ...stationWhere,
          isActive: true,
        },
      }),

      // Court cases
      prisma.courtFile.count({
        where: {
          case: caseWhere,
        },
      }),

      // Recent cases
      prisma.case.findMany({
        where: caseWhere,
        include: {
          reportedBy: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
            },
          },
          station: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent activity
      prisma.activityLog.findMany({
        where: {
          user: stationWhere.id
            ? {
                stationId: stationWhere.id,
              }
            : undefined,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Monthly statistics (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as count
        FROM "Case"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        ${caseWhere.stationId ? prisma.$queryRaw`AND "stationId" = ${caseWhere.stationId}` : prisma.$queryRaw``}
        GROUP BY month
        ORDER BY month DESC
      `,
    ]);

    // Calculate percentage changes (comparing to last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [lastMonthTotal, lastMonthPending] = await Promise.all([
      prisma.case.count({
        where: {
          ...caseWhere,
          createdAt: {
            gte: lastMonth,
            lt: new Date(),
          },
        },
      }),
      prisma.case.count({
        where: {
          ...caseWhere,
          status: {
            in: ['REPORTED', 'UNDER_INVESTIGATION'],
          },
          createdAt: {
            gte: lastMonth,
            lt: new Date(),
          },
        },
      }),
    ]);

    const totalChange =
      totalCases > 0
        ? ((lastMonthTotal / totalCases) * 100).toFixed(1)
        : '0.0';
    const pendingChange =
      pendingCases > 0
        ? ((lastMonthPending / pendingCases) * 100).toFixed(1)
        : '0.0';

    return NextResponse.json({
      stats: {
        totalCases: {
          count: totalCases,
          change: `+${totalChange}% from last month`,
        },
        pendingCases: {
          count: pendingCases,
          urgent: urgentCases,
        },
        officersActive: {
          count: activeOfficers,
          status: 'All shifts covered',
        },
        courtCases: {
          count: courtCases,
          thisWeek: 0, // Can be calculated if needed
        },
      },
      recentCases: recentCases.map((c) => ({
        id: c.id,
        obNumber: c.obNumber,
        title: c.title,
        category: c.category,
        status: c.status,
        priority: c.priority,
        location: c.location,
        reportedBy: `${c.reportedBy.rank} ${c.reportedBy.firstName} ${c.reportedBy.lastName}`,
        station: c.station.name,
        createdAt: c.createdAt,
      })),
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        action: a.action,
        description: `${a.user.rank} ${a.user.firstName} ${a.user.lastName}`,
        timestamp: a.createdAt,
        metadata: a.metadata,
      })),
      monthlyStats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
