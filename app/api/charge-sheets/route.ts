import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    const chargeSheets = await prisma.chargeSheet.findMany({
      where: caseId ? { caseId } : undefined,
      include: {
        case: { select: { obNumber: true, title: true, station: { select: { name: true } } } },
        createdBy: { select: { firstName: true, lastName: true, rank: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ chargeSheets });
  } catch (error) {
    console.error('Get charge sheets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const {
      caseId, courtFileNo, odppCaseNo, odppStation, policeCaseNo, dateDrafted,
      accusedFirstName, accusedSurname, accusedIdNumber, accusedSex, accusedNationality,
      accusedApparentAge, accusedAddress, charge, particularsOfOffence,
      wasArrested, dateOfArrest, withoutWarrant, dateApprehensionReport,
      bondOrBail, summonsMade, remandedOrAdjourned, complainant, witnesses,
      sentenceCourtDate, prosecutorName, prosecutorRank,
    } = body;

    if (!caseId || !accusedFirstName || !accusedSurname || !charge || !particularsOfOffence) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const chargeSheet = await prisma.chargeSheet.create({
      data: {
        caseId,
        createdById: user.userId,
        courtFileNo: courtFileNo || null,
        odppCaseNo: odppCaseNo || null,
        odppStation: odppStation || null,
        policeCaseNo: policeCaseNo || null,
        dateDrafted: dateDrafted ? new Date(dateDrafted) : new Date(),
        accusedFirstName,
        accusedSurname,
        accusedIdNumber: accusedIdNumber || null,
        accusedSex: accusedSex || 'MALE',
        accusedNationality: accusedNationality || null,
        accusedApparentAge: accusedApparentAge || null,
        accusedAddress: accusedAddress || null,
        charge,
        particularsOfOffence,
        wasArrested: wasArrested !== false,
        dateOfArrest: dateOfArrest ? new Date(dateOfArrest) : null,
        withoutWarrant: withoutWarrant !== false,
        dateApprehensionReport: dateApprehensionReport ? new Date(dateApprehensionReport) : null,
        bondOrBail: bondOrBail || null,
        summonsMade: summonsMade === true,
        remandedOrAdjourned: remandedOrAdjourned || null,
        complainant: complainant || null,
        witnesses: witnesses || null,
        sentenceCourtDate: sentenceCourtDate || null,
        prosecutorName: prosecutorName || null,
        prosecutorRank: prosecutorRank || null,
      },
    });

    return NextResponse.json({ chargeSheet }, { status: 201 });
  } catch (error) {
    console.error('Create charge sheet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
