import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withAuth, AuthenticatedRequest } from '@/lib/auth.proxy';
import { CaseStatus, CasePriority } from '@/types';
import { verifyToken } from '@/lib/auth';

const updateCaseSchema = z.object({
  status: z.nativeEnum(CaseStatus).optional(),
  priority: z.nativeEnum(CasePriority).optional(),
  assignedToId: z.string().optional(),
  notes: z.string().optional(),
});

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/cases/[id] - Get case details //TODO: allow access
export const GET =
  async (req: NextRequest, { params }: RouteContext) => {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      const { id } = await params;
      const token = authHeader.substring(7);

      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
      }




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
        user.role !== 'INSPECTOR_GENERAL' &&
        user.role !== 'DEPUTY_INSPECTOR_GENERAL'
      ) {
        if (user.role === 'COUNTY_COMMANDER') {
          const station = await prisma.station.findUnique({
            where: { id: caseData.stationId },
          });
          if (station?.countyId !== user.countyId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
          }
        } else if (caseData.stationId !== user.stationId) {
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


// PATCH /api/cases/[id] - Update case
export const PATCH =
  async (req: NextRequest, { params }: RouteContext) => {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      const { id } = await params;
      const token = authHeader.substring(7);

      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
      }
      const body = await req.json();

      // Validate input
      const validation = updateCaseSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.message },
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
        user.role !== 'INSPECTOR_GENERAL' &&
        user.role !== 'DEPUTY_INSPECTOR_GENERAL' &&
        user.role !== 'COUNTY_COMMANDER' &&
        user.role !== 'OCS' &&
        user.role !== 'OCPD'
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
              updateBy: user.userId,
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
            userId: user.userId,
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


// DELETE /api/cases/[id] - Delete case (admin only)
export const DELETE =
  async (req: NextRequest, { params }: RouteContext) => {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      const { id } = await params;
      const token = authHeader.substring(7);

      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
      }

      // Only IG, DIG, and OCS can delete
      if (
        user.role !== 'INSPECTOR_GENERAL' &&
        user.role !== 'DEPUTY_INSPECTOR_GENERAL' &&
        user.role !== 'OCS'
      ) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }


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
            userId: user.userId,
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

