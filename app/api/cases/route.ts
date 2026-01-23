import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { z } from 'zod';
import { CaseCategory, CasePriority } from '@prisma/client';

const createCaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(CaseCategory),
  priority: z.nativeEnum(CasePriority).optional(),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  incidentDate: z.string().datetime(),
  stationId: z.string().optional(),
});

// GET /api/cases - List cases
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};

    // Role-based filtering
    if (
      req.user.role !== 'INSPECTOR_GENERAL' &&
      req.user.role !== 'DEPUTY_INSPECTOR_GENERAL'
    ) {
      if (req.user.role === 'COUNTY_COMMANDER' && req.user.countyId) {
        // County commander sees all stations in their county
        where.station = {
          countyId: req.user.countyId,
        };
      } else if (req.user.stationId) {
        // Other roles see only their station
        where.stationId = req.user.stationId;
      }
    }

    // Apply filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { obNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              serviceNumber: true,
              rank: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              serviceNumber: true,
              rank: true,
            },
          },
          station: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          suspects: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              isCustody: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      cases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get cases error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// POST /api/cases - Create new case
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validation = createCaseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Determine station ID
    const stationId = data.stationId || req.user.stationId;
    if (!stationId) {
      return NextResponse.json(
        { error: 'Station ID is required' },
        { status: 400 }
      );
    }

    // Get station for OB number generation
    const station = await prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      return NextResponse.json(
        { error: 'Station not found' },
        { status: 404 }
      );
    }

    // Generate OB number
    const year = new Date().getFullYear();
    const caseCount = await prisma.case.count({
      where: {
        stationId,
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });
    const obNumber = `OB/${year}/${String(caseCount + 1).padStart(6, '0')}`;

    // Create case with OB entry
    const caseData = await prisma.$transaction(async (tx) => {
      // Create case
      const newCase = await tx.case.create({
        data: {
          obNumber,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority || 'MEDIUM',
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          incidentDate: new Date(data.incidentDate),
          reportedById: req.user!.userId,
          stationId,
        },
        include: {
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              serviceNumber: true,
              rank: true,
            },
          },
          station: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

      // Get next entry number for the station
      const lastEntry = await tx.oBEntry.findFirst({
        where: { stationId },
        orderBy: { entryNumber: 'desc' },
      });
      const entryNumber = (lastEntry?.entryNumber || 0) + 1;

      // Create OB entry
      await tx.oBEntry.create({
        data: {
          caseId: newCase.id,
          entryNumber,
          stationId,
          officerId: req.user!.userId,
          description: data.description,
        },
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          userId: req.user!.userId,
          action: 'CREATE_CASE',
          entityType: 'CASE',
          entityId: newCase.id,
          metadata: {
            obNumber: newCase.obNumber,
            title: newCase.title,
          },
        },
      });

      return newCase;
    });

    return NextResponse.json(caseData, { status: 201 });
  } catch (error) {
    console.error('Create case error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
