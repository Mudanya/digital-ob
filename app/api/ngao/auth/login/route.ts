import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { generateNgaoToken } from '@/lib/ngao-auth';

export async function POST(req: NextRequest) {
  try {
    const { serviceId, password } = await req.json();

    if (!serviceId || !password) {
      return NextResponse.json({ error: 'serviceId and password are required' }, { status: 400 });
    }

    const officer = await prisma.ngaoOfficer.findUnique({
      where: { serviceId },
      include: {
        subCounty: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
        subLocation: { select: { id: true, name: true } },
      },
    });

    if (!officer || !officer.isActive) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordValid = await verifyPassword(password, officer.password);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await prisma.ngaoOfficer.update({
      where: { id: officer.id },
      data: { lastLogin: new Date() },
    });

    const token = generateNgaoToken({
      ngaoId: officer.id,
      serviceId: officer.serviceId,
      role: officer.role,
      locationId: officer.locationId || undefined,
      subLocationId: officer.subLocationId || undefined,
      subCountyId: officer.subCountyId || undefined,
    });

    const { password: _, ...officerData } = officer;

    return NextResponse.json({ token, officer: officerData });
  } catch (error) {
    console.error('NGAO login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
