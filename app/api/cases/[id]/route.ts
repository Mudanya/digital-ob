import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { z } from 'zod';
import { CaseStatus, CasePriority } from '@prisma/client';

const updateCaseSchema = z.object({
  status: z.nativeEnum(CaseStatus).optional(),
  priority: z.nativeEnum(CasePriority).optional(),
  assignedToId: z.string().optional(),
  notes: z.string().optional(),
});

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/cases/[id] - Get case details
export const GET = withAuth(
  async (req: AuthenticatedRequest, context: RouteContext) => {
    try {
      if (!req.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { id } = context.params;

      const caseData = await prisma.case.findUnique({
        where: { id },
        include: {
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              serviceNumber: true,
              rank: true,
              phoneNumber: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              serviceNumber: true,
              rank: true,
              phoneNumber: true,
            },
          },
          station: {
            select: {
              id: true,
              name: true,
              code: true,
              address: true,
              phoneNumber: true,
            },
          },
          obEntry: true,
          suspects: true,
          victims: true,
          witnesses: true,
          evidence: true,
          caseUpdates: {
            orderBy: { createdAt: 'desc' },
          },
          courtFiles: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!caseData) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }

      // Check access permissions
      if (
        req.user.role !== 'INSPECTOR_GENERAL' &&
        req.user.role !== 'DEPUTY_INSPECTOR_GENERAL'
      ) {
        if (req.user.role === 'COUNTY_COMMANDER') {
          const station = await prisma.station.findUnique({
            where: { id: caseData.stationId },
          });
          if (station?.countyId !== req.user.countyId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
          }
        } else if (caseData.stationId !== req.user.stationId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }

      return NextResponse.json(caseData);
    } catch (error) {
      console.error('Get case error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

// PATCH /api/cases/[id] - Update case
export const PATCH = withAuth(
  async (req: AuthenticatedRequest, context: RouteContext) => {
    try {
      if (!req.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { id } = context.params;
      const body = await req.json();

      // Validate input
      const validation = updateCaseSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.errors },
          { status: 400 }
        );
      }

      const data = validation.data;

      // Get existing case
      const existingCase = await prisma.case.findUnique({
        where: { id },
      });

      if (!existingCase) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }

      // Check permissions
      if (
        req.user.role !== 'INSPECTOR_GENERAL' &&
        req.user.role !== 'DEPUTY_INSPECTOR_GENERAL' &&
        req.user.role !== 'COUNTY_COMMANDER' &&
        req.user.role !== 'OCS' &&
        req.user.role !== 'OCPD'
      ) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Update case with transaction
      const updatedCase = await prisma.$transaction(async (tx) => {
        // Update case
        const updated = await tx.case.update({
          where: { id },
          data: {
            ...(data.status && { status: data.status }),
            ...(data.priority && { priority: data.priority }),
            ...(data.assignedToId && { assignedToId: data.assignedToId }),
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
          },
        });

        // Create case update log
        const updateDescription = [];
        if (data.status && data.status !== existingCase.status) {
          updateDescription.push(`Status changed from ${existingCase.status} to ${data.status}`);
        }
        if (data.priority && data.priority !== existingCase.priority) {
          updateDescription.push(`Priority changed from ${existingCase.priority} to ${data.priority}`);
        }
        if (data.assignedToId) {
          updateDescription.push(`Case assigned to officer`);
        }
        if (data.notes) {
          updateDescription.push(data.notes);
        }

        if (updateDescription.length > 0) {
          await tx.caseUpdate.create({
            data: {
              caseId: id,
              updateBy: req.user!.userId,
              updateType: 'STATUS_CHANGE',
              description: updateDescription.join('. '),
            },
          });
        }

        // Create notification for assigned officer
        if (data.assignedToId && data.assignedToId !== existingCase.assignedToId) {
          await tx.notification.create({
            data: {
              userId: data.assignedToId,
              title: 'New Case Assigned',
              message: `Case ${existingCase.obNumber} has been assigned to you`,
              type: 'CASE_ASSIGNMENT',
              metadata: {
                caseId: id,
                obNumber: existingCase.obNumber,
              },
            },
          });
        }

        // Log activity
        await tx.activityLog.create({
          data: {
            userId: req.user!.userId,
            action: 'UPDATE_CASE',
            entityType: 'CASE',
            entityId: id,
            metadata: {
              obNumber: existingCase.obNumber,
              changes: data,
            },
          },
        });

        return updated;
      });

      return NextResponse.json(updatedCase);
    } catch (error) {
      console.error('Update case error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/cases/[id] - Delete case (admin only)
export const DELETE = withAuth(
  async (req: AuthenticatedRequest, context: RouteContext) => {
    try {
      if (!req.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Only IG, DIG, and OCS can delete
      if (
        req.user.role !== 'INSPECTOR_GENERAL' &&
        req.user.role !== 'DEPUTY_INSPECTOR_GENERAL' &&
        req.user.role !== 'OCS'
      ) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const { id } = context.params;

      const existingCase = await prisma.case.findUnique({
        where: { id },
      });

      if (!existingCase) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }

      await prisma.$transaction(async (tx) => {
        // Delete case (cascade will handle related records)
        await tx.case.delete({
          where: { id },
        });

        // Log activity
        await tx.activityLog.create({
          data: {
            userId: req.user!.userId,
            action: 'DELETE_CASE',
            entityType: 'CASE',
            entityId: id,
            metadata: {
              obNumber: existingCase.obNumber,
              title: existingCase.title,
            },
          },
        });
      });

      return NextResponse.json({ message: 'Case deleted successfully' });
    } catch (error) {
      console.error('Delete case error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);
