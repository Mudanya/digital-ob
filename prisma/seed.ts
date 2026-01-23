import { CaseCategory, CasePriority, CaseStatus, UserRole } from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

import bcrypt from 'bcryptjs';



async function main() {
  console.log('Starting database seed...');

  // Create Counties
  const nairobi = await prisma.county.upsert({
    where: { code: 'NBI' },
    update: {},
    create: {
      name: 'Nairobi',
      code: 'NBI',
      region: 'Central',
    },
  });

  const kiambu = await prisma.county.upsert({
    where: { code: 'KBU' },
    update: {},
    create: {
      name: 'Kiambu',
      code: 'KBU',
      region: 'Central',
    },
  });

  console.log('✓ Counties created');

  // Create Stations
  const centralStation = await prisma.station.upsert({
    where: { code: 'NBI-CENTRAL' },
    update: {},
    create: {
      name: 'Nairobi Central Police Station',
      code: 'NBI-CENTRAL',
      countyId: nairobi.id,
      address: 'University Way, Nairobi',
      phoneNumber: '+254-20-222222',
      latitude: -1.286389,
      longitude: 36.817223,
    },
  });

  const kilileshwaStation = await prisma.station.upsert({
    where: { code: 'NBI-KILIMANI' },
    update: {},
    create: {
      name: 'Kilimani Police Station',
      code: 'NBI-KILIMANI',
      countyId: nairobi.id,
      address: 'Kilimani, Nairobi',
      phoneNumber: '+254-20-333333',
      latitude: -1.295,
      longitude: 36.787,
    },
  });

  const ruiruStation = await prisma.station.upsert({
    where: { code: 'KBU-RUIRU' },
    update: {},
    create: {
      name: 'Ruiru Police Station',
      code: 'KBU-RUIRU',
      countyId: kiambu.id,
      address: 'Ruiru Town, Kiambu',
      phoneNumber: '+254-20-444444',
      latitude: -1.150,
      longitude: 36.961,
    },
  });

  console.log('✓ Stations created');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Inspector General
  const ig = await prisma.user.upsert({
    where: { serviceNumber: 'IG-001' },
    update: {},
    create: {
      serviceNumber: 'IG-001',
      email: 'ig@nps.go.ke',
      password: hashedPassword,
      firstName: 'Japheth',
      lastName: 'Koome',
      phoneNumber: '+254-700-000001',
      role: UserRole.INSPECTOR_GENERAL,
      rank: 'Inspector General',
    },
  });

  // County Commander - Nairobi
  const countyCommander = await prisma.user.upsert({
    where: { serviceNumber: 'CC-001' },
    update: {},
    create: {
      serviceNumber: 'CC-001',
      email: 'cc.nairobi@nps.go.ke',
      password: hashedPassword,
      firstName: 'James',
      lastName: 'Mugera',
      phoneNumber: '+254-700-000002',
      role: UserRole.COUNTY_COMMANDER,
      rank: 'County Commander',
      countyId: nairobi.id,
    },
  });

  // OCS - Central Station
  const ocs = await prisma.user.upsert({
    where: { serviceNumber: 'OCS-001' },
    update: {},
    create: {
      serviceNumber: 'OCS-001',
      email: 'ocs.central@nps.go.ke',
      password: hashedPassword,
      firstName: 'Peter',
      lastName: 'Kimani',
      phoneNumber: '+254-700-000003',
      role: UserRole.OCS,
      rank: 'Chief Inspector',
      stationId: centralStation.id,
    },
  });

  // Inspector
  const inspector = await prisma.user.upsert({
    where: { serviceNumber: 'INS-001' },
    update: {},
    create: {
      serviceNumber: 'INS-001',
      email: 'john.kamau@nps.go.ke',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Kamau',
      phoneNumber: '+254-700-000004',
      role: UserRole.INSPECTOR,
      rank: 'Inspector',
      stationId: centralStation.id,
    },
  });

  // Sergeant
  const sergeant = await prisma.user.upsert({
    where: { serviceNumber: 'SGT-001' },
    update: {},
    create: {
      serviceNumber: 'SGT-001',
      email: 'mary.wanjiku@nps.go.ke',
      password: hashedPassword,
      firstName: 'Mary',
      lastName: 'Wanjiku',
      phoneNumber: '+254-700-000005',
      role: UserRole.SERGEANT,
      rank: 'Sergeant',
      stationId: centralStation.id,
    },
  });

  // Constables
  const constable1 = await prisma.user.upsert({
    where: { serviceNumber: 'PC-001' },
    update: {},
    create: {
      serviceNumber: 'PC-001',
      email: 'david.omondi@nps.go.ke',
      password: hashedPassword,
      firstName: 'David',
      lastName: 'Omondi',
      phoneNumber: '+254-700-000006',
      role: UserRole.CONSTABLE,
      rank: 'Police Constable',
      stationId: centralStation.id,
    },
  });

  const constable2 = await prisma.user.upsert({
    where: { serviceNumber: 'PC-002' },
    update: {},
    create: {
      serviceNumber: 'PC-002',
      email: 'grace.mwangi@nps.go.ke',
      password: hashedPassword,
      firstName: 'Grace',
      lastName: 'Mwangi',
      phoneNumber: '+254-700-000007',
      role: UserRole.CONSTABLE,
      rank: 'Police Constable',
      stationId: centralStation.id,
    },
  });

  console.log('✓ Users created');

  // Create Sample Cases
  const case1 = await prisma.case.create({
    data: {
      obNumber: 'OB/2024/001567',
      title: 'Armed Robbery - Westlands Area',
      description: 'Armed robbery reported at a supermarket on Waiyaki Way. Three suspects armed with firearms stole cash and goods worth approximately KES 500,000.',
      category: CaseCategory.ROBBERY,
      status: CaseStatus.UNDER_INVESTIGATION,
      priority: CasePriority.URGENT,
      location: 'Waiyaki Way, Westlands',
      latitude: -1.2636,
      longitude: 36.8063,
      incidentDate: new Date('2024-01-20T14:30:00'),
      reportedById: constable1.id,
      assignedToId: inspector.id,
      stationId: centralStation.id,
    },
  });

  // Create OB Entry for case1
  await prisma.oBEntry.create({
    data: {
      caseId: case1.id,
      entryNumber: 1567,
      stationId: centralStation.id,
      officerId: constable1.id,
      description: 'Armed robbery reported at supermarket. Initial response unit dispatched.',
    },
  });

  // Create suspects for case1
  await prisma.suspect.create({
    data: {
      caseId: case1.id,
      firstName: 'Unknown',
      lastName: 'Suspect 1',
      description: 'Male, approximately 25-30 years old, wearing a black hoodie',
      isCustody: false,
    },
  });

  // Create more cases
  const case2 = await prisma.case.create({
    data: {
      obNumber: 'OB/2024/001568',
      title: 'Traffic Accident - Thika Road',
      description: 'Multiple vehicle collision on Thika Superhighway near Githurai. Two casualties reported.',
      category: CaseCategory.TRAFFIC,
      status: CaseStatus.REPORTED,
      priority: CasePriority.HIGH,
      location: 'Thika Road, Githurai',
      latitude: -1.2167,
      longitude: 36.8833,
      incidentDate: new Date('2024-01-21T08:15:00'),
      reportedById: constable2.id,
      stationId: centralStation.id,
    },
  });

  await prisma.oBEntry.create({
    data: {
      caseId: case2.id,
      entryNumber: 1568,
      stationId: centralStation.id,
      officerId: constable2.id,
      description: 'Traffic accident reported. Ambulance and traffic officers dispatched.',
    },
  });

  const case3 = await prisma.case.create({
    data: {
      obNumber: 'OB/2024/001569',
      title: 'Domestic Dispute - Kilimani',
      description: 'Domestic violence reported. Victim has minor injuries.',
      category: CaseCategory.DOMESTIC,
      status: CaseStatus.RESOLVED,
      priority: CasePriority.MEDIUM,
      location: 'Kilimani Estate',
      latitude: -1.2950,
      longitude: 36.7870,
      incidentDate: new Date('2024-01-19T22:00:00'),
      reportedById: sergeant.id,
      assignedToId: sergeant.id,
      stationId: centralStation.id,
    },
  });

  await prisma.oBEntry.create({
    data: {
      caseId: case3.id,
      entryNumber: 1569,
      stationId: centralStation.id,
      officerId: sergeant.id,
      description: 'Domestic dispute resolved. Parties counseled and separated.',
    },
  });

  console.log('✓ Sample cases created');

  // Create Traffic Offenses
  await prisma.trafficOffense.create({
    data: {
      offenseNumber: 'TO/2024/0001',
      officerId: constable1.id,
      driverName: 'Patrick Mwangi',
      driverIdNumber: '12345678',
      driverLicense: 'DL123456',
      vehicleReg: 'KCA 123A',
      offenseType: 'Speeding',
      location: 'Uhuru Highway',
      fineAmount: 5000,
      offenseDate: new Date('2024-01-21T10:30:00'),
    },
  });

  await prisma.trafficOffense.create({
    data: {
      offenseNumber: 'TO/2024/0002',
      officerId: constable2.id,
      driverName: 'Jane Mutua',
      vehicleReg: 'KBZ 456B',
      offenseType: 'Illegal Parking',
      location: 'City Center',
      fineAmount: 2000,
      isPaid: true,
      offenseDate: new Date('2024-01-20T15:00:00'),
    },
  });

  console.log('✓ Traffic offenses created');

  // Create Activity Logs
  await prisma.activityLog.create({
    data: {
      userId: inspector.id,
      action: 'CASE_RESOLVED',
      entityType: 'CASE',
      entityId: case3.id,
      metadata: {
        obNumber: case3.obNumber,
        resolution: 'Parties counseled',
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: constable1.id,
      action: 'CREATE_CASE',
      entityType: 'CASE',
      entityId: case1.id,
      metadata: {
        obNumber: case1.obNumber,
      },
    },
  });

  console.log('✓ Activity logs created');

  // Create Notifications
  await prisma.notification.create({
    data: {
      userId: inspector.id,
      title: 'New Case Assigned',
      message: `Case ${case1.obNumber} has been assigned to you`,
      type: 'CASE_ASSIGNMENT',
      metadata: {
        caseId: case1.id,
        obNumber: case1.obNumber,
      },
    },
  });

  console.log('✓ Notifications created');

  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('────────────────────────────────────────');
  console.log('Inspector General:');
  console.log('  Service Number: IG-001');
  console.log('  Email: ig@nps.go.ke');
  console.log('  Password: password123');
  console.log('\nCounty Commander (Nairobi):');
  console.log('  Service Number: CC-001');
  console.log('  Email: cc.nairobi@nps.go.ke');
  console.log('  Password: password123');
  console.log('\nOCS (Central Station):');
  console.log('  Service Number: OCS-001');
  console.log('  Email: ocs.central@nps.go.ke');
  console.log('  Password: password123');
  console.log('\nInspector:');
  console.log('  Service Number: INS-001');
  console.log('  Email: john.kamau@nps.go.ke');
  console.log('  Password: password123');
  console.log('\nConstable:');
  console.log('  Service Number: PC-001');
  console.log('  Email: david.omondi@nps.go.ke');
  console.log('  Password: password123');
  console.log('────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
