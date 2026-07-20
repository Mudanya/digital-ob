import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withNgaoAuth, NgaoAuthenticatedRequest } from '@/lib/ngao-auth.proxy';

export const GET = withNgaoAuth(async (req: NgaoAuthenticatedRequest) => {
  try {
    if (!req.ngaoUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const messages = await prisma.ngaoMessage.findMany({
      where: {
        OR: [
          { fromNgaoId: req.ngaoUser.ngaoId },
          { toNgaoId: req.ngaoUser.ngaoId },
        ],
      },
      include: {
        fromNgao: { select: { name: true, role: true, serviceId: true } },
        toNgao: { select: { name: true, role: true, serviceId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mark received messages as read
    await prisma.ngaoMessage.updateMany({
      where: { toNgaoId: req.ngaoUser.ngaoId, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get NGAO messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withNgaoAuth(async (req: NgaoAuthenticatedRequest) => {
  try {
    if (!req.ngaoUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { toNgaoId, toOfficerId, subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'subject and message are required' }, { status: 400 });
    }

    if (!toNgaoId && !toOfficerId) {
      return NextResponse.json({ error: 'toNgaoId or toOfficerId is required' }, { status: 400 });
    }

    const created = await prisma.ngaoMessage.create({
      data: {
        fromNgaoId: req.ngaoUser.ngaoId,
        toNgaoId: toNgaoId || null,
        toOfficerId: toOfficerId || null,
        subject,
        message,
      },
      include: {
        fromNgao: { select: { name: true, role: true } },
        toNgao: { select: { name: true, role: true } },
      },
    });

    return NextResponse.json({ message: created }, { status: 201 });
  } catch (error) {
    console.error('Send NGAO message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
