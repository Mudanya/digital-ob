import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';
import { z } from 'zod';
import { CaseCategory, CasePriority } from '@/types';


const createCaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(CaseCategory),
  priority: z.enum(CasePriority).optional(),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  incidentDate: z.string().min(1, 'Incident date is required'),
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

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { station: true },
    });

    if (!user || !user.stationId) {
      return NextResponse.json(
        { error: "User or station not found" },
        { status: 404 }
      );
    }

    // Generate OB Number
    const lastEntry = await prisma.oBEntry.findFirst({
      where: { stationId: user.stationId },
      orderBy: { entryNumber: "desc" },
    });

    const nextEntryNumber = (lastEntry?.entryNumber || 0) + 1;
    const year = new Date().getFullYear();
    const obNumber = `${user.station?.code}/${year}/${String(nextEntryNumber).padStart(4, "0")}`;

    // Create case with all related data
    const newCase = await prisma.case.create({
      data: {
        obNumber,
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority || "MEDIUM",
        location: body.location,
        latitude: body.latitude,
        longitude: body.longitude,
        incidentDate: new Date(body.incidentDate),
        reportedById: user.id,
        assignedToId: body.assignedToId || null,
        stationId: user.stationId,

        // Create OB Entry
        obEntry: {
          create: {
            entryNumber: nextEntryNumber,
            stationId: user.stationId,
            officerId: user.id,
            description: body.description,
          },
        },

        // Create Reporting Persons
        reportingPersons: body.reportingPersons?.length > 0 ? {
          create: body.reportingPersons.map((person: any) => ({
            name: person.name,
            contact: person.contact,
            idNumber: person.idNumber,
            address: person.address,
            email: person.email,
          })),
        } : undefined,

        // Create Witnesses
        witnesses: body.witnesses?.length > 0 ? {
          create: body.witnesses.map((witness: any) => ({
            name: witness.name,
            contact: witness.contact,
            address: witness.address,
            statement: witness.statement,
          })),
        } : undefined,

        // Create Suspects
        suspects: body.suspects?.length > 0 ? {
          create: body.suspects.map((suspect: any) => ({
            firstName: suspect.firstName,
            lastName: suspect.lastName,
            idNumber: suspect.idNumber,
            phoneNumber: suspect.phoneNumber,
            description: suspect.description,
            charges: suspect.charges,
            isCustody: suspect.isCustody || false,
            arrestDate: suspect.isCustody ? new Date() : null,
          })),
        } : undefined,

        // Create Items Lost
        itemsLost: body.itemsLost?.length > 0 ? {
          create: body.itemsLost.map((item: any) => ({
            description: item.description,
            quantity: parseInt(item.quantity) || 1,
            estimatedValue: item.estimatedValue ? parseFloat(item.estimatedValue) : null,
          })),
        } : undefined,

        // Create Items Recovered
        itemsRecovered: body.itemsRecovered?.length > 0 ? {
          create: body.itemsRecovered.map((item: any) => ({
            description: item.description,
            quantity: parseInt(item.quantity) || 1,
            condition: item.condition,
            locationFound: item.locationFound,
            recoveredDate: new Date(),
          })),
        } : undefined,

        // Create Vehicles
        vehicles: body.vehicles?.length > 0 ? {
          create: body.vehicles.map((vehicle: any) => ({
            make: vehicle.make,
            model: vehicle.model,
            registrationNumber: vehicle.registrationNumber,
            color: vehicle.color,
            ownerName: vehicle.ownerName,
          })),
        } : undefined,

        // Create Cell Admission
        cellAdmissions: body.cellAdmission?.admitted ? {
          create: {
            suspectName: body.cellAdmission.suspectName,
            cellNumber: body.cellAdmission.cellNumber,
            admissionTime: new Date(body.cellAdmission.admissionTime),
            itemsAtCounter: body.cellAdmission.itemsAtCounter,
            reason: body.cellAdmission.reason,
            authorizedById: user.id,
            status: "IN_CUSTODY",
          },
        } : undefined,

        // Create Payment
        payments: body.payment?.required ? {
          create: {
            paymentType: body.payment.type,
            amount: parseFloat(body.payment.amount),
            status: body.payment.status || "PENDING",
            paymentMethod: body.payment.method || null,
            transactionId: body.payment.transactionId || null,
            paidAt: body.payment.status === "PAID" ? new Date() : null,
          },
        } : undefined,
      },
      include: {
        reportedBy: true,
        assignedTo: true,
        station: true,
        obEntry: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "CREATE_CASE",
        entityType: "Case",
        entityId: newCase.id,
        metadata: { obNumber: newCase.obNumber },
      },
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error('Create case error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
