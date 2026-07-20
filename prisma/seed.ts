import {
  CaseCategory,
  CasePriority,
  CaseStatus,
  NgaoRole,
  UserRole,
  WeaponCondition,
  WeaponStatus,
  WeaponType,
} from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting database seed...');

  // ─────────────────────────────────────
  // REGIONS (8 Kenya Police regions)
  // ─────────────────────────────────────
  const regionData = [
    { name: 'Nairobi', code: 'NBI-RGN' },
    { name: 'Central', code: 'CTL-RGN' },
    { name: 'Eastern', code: 'EST-RGN' },
    { name: 'North Eastern', code: 'NE-RGN' },
    { name: 'Rift Valley', code: 'RV-RGN' },
    { name: 'Coast', code: 'CST-RGN' },
    { name: 'Western', code: 'WST-RGN' },
    { name: 'Nyanza', code: 'NYZ-RGN' },
  ];

  const regions: Record<string, { id: string }> = {};
  for (const r of regionData) {
    const region = await prisma.region.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
    regions[r.name] = region;
  }
  console.log('✓ Regions created');

  // ─────────────────────────────────────
  // COUNTIES
  // ─────────────────────────────────────
  const nairobi = await prisma.county.upsert({
    where: { code: 'NBI' },
    update: {},
    create: {
      name: 'Nairobi',
      code: 'NBI',
      regionId: regions['Nairobi'].id,
    },
  });

  const kiambu = await prisma.county.upsert({
    where: { code: 'KBU' },
    update: {},
    create: {
      name: 'Kiambu',
      code: 'KBU',
      regionId: regions['Central'].id,
    },
  });

  console.log('✓ Counties created');

  // ─────────────────────────────────────
  // SUB-COUNTIES
  // ─────────────────────────────────────
  const westlandsSubCounty = await prisma.subCounty.upsert({
    where: { code: 'NBI-WSTL' },
    update: {},
    create: {
      name: 'Westlands',
      code: 'NBI-WSTL',
      countyId: nairobi.id,
    },
  });

  const ruiruSubCounty = await prisma.subCounty.upsert({
    where: { code: 'KBU-RUIRU' },
    update: {},
    create: {
      name: 'Ruiru',
      code: 'KBU-RUIRU',
      countyId: kiambu.id,
    },
  });

  console.log('✓ Sub-counties created');

  // ─────────────────────────────────────
  // LOCATIONS (Chief areas)
  // ─────────────────────────────────────
  const kilimaniLocation = await prisma.location.upsert({
    where: { id: 'loc-kilimani' },
    update: {},
    create: {
      id: 'loc-kilimani',
      name: 'Kilimani',
      subCountyId: westlandsSubCounty.id,
    },
  });

  const parklandsLocation = await prisma.location.upsert({
    where: { id: 'loc-parklands' },
    update: {},
    create: {
      id: 'loc-parklands',
      name: 'Parklands',
      subCountyId: westlandsSubCounty.id,
    },
  });

  console.log('✓ Locations created');

  // ─────────────────────────────────────
  // SUB-LOCATIONS (Sub-Chief areas)
  // ─────────────────────────────────────
  const kilimaniNorthSubLocation = await prisma.subLocation.upsert({
    where: { id: 'subloc-kilimani-north' },
    update: {},
    create: {
      id: 'subloc-kilimani-north',
      name: 'Kilimani North',
      locationId: kilimaniLocation.id,
    },
  });

  console.log('✓ Sub-locations created');

  // ─────────────────────────────────────
  // STATIONS
  // ─────────────────────────────────────
  const centralStation = await prisma.station.upsert({
    where: { code: 'NBI-CENTRAL' },
    update: {},
    create: {
      name: 'Nairobi Central Police Station',
      code: 'NBI-CENTRAL',
      countyId: nairobi.id,
      subCountyId: westlandsSubCounty.id,
      address: 'University Way, Nairobi',
      phoneNumber: '+254-20-222222',
      latitude: -1.286389,
      longitude: 36.817223,
    },
  });

  const kilimaniStation = await prisma.station.upsert({
    where: { code: 'NBI-KILIMANI' },
    update: {},
    create: {
      name: 'Kilimani Police Station',
      code: 'NBI-KILIMANI',
      countyId: nairobi.id,
      subCountyId: westlandsSubCounty.id,
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
      subCountyId: ruiruSubCounty.id,
      address: 'Ruiru Town, Kiambu',
      phoneNumber: '+254-20-444444',
      latitude: -1.150,
      longitude: 36.961,
    },
  });

  console.log('✓ Stations created');

  // ─────────────────────────────────────
  // POLICE USERS
  // ─────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Asqari26JeshReng23!', 12);

  const ig = await prisma.user.upsert({
    where: { serviceNumber: 'IG-001' },
    update: { password: hashedPassword },
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

  const countyCommander = await prisma.user.upsert({
    where: { serviceNumber: 'CC-001' },
    update: { password: hashedPassword },
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

  const ocs = await prisma.user.upsert({
    where: { serviceNumber: 'OCS-001' },
    update: { password: hashedPassword },
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

  const inspector = await prisma.user.upsert({
    where: { serviceNumber: 'INS-001' },
    update: { password: hashedPassword },
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

  const sergeant = await prisma.user.upsert({
    where: { serviceNumber: 'SGT-001' },
    update: { password: hashedPassword },
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

  const constable1 = await prisma.user.upsert({
    where: { serviceNumber: 'PC-001' },
    update: { password: hashedPassword },
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

  // ─────────────────────────────────────
  // SAMPLE CASES
  // ─────────────────────────────────────
  const case1 = await prisma.case.upsert({
    where: { obNumber: 'OB/2024/001567' },
    update: {},
    create: {
      obNumber: 'OB/2024/001567',
      title: 'Armed Robbery - Westlands Area',
      description:
        'Armed robbery reported at a supermarket on Waiyaki Way. Three suspects armed with firearms stole cash and goods worth approximately KES 500,000.',
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

  await prisma.oBEntry.upsert({
    where: { caseId: case1.id },
    update: {},
    create: {
      caseId: case1.id,
      entryNumber: 1567,
      stationId: centralStation.id,
      officerId: constable1.id,
      description: 'Armed robbery reported at supermarket. Initial response unit dispatched.',
    },
  });

  const existingSuspect = await prisma.suspect.findFirst({ where: { caseId: case1.id } });
  if (!existingSuspect) {
    await prisma.suspect.create({
      data: {
        caseId: case1.id,
        firstName: 'Unknown',
        lastName: 'Suspect 1',
        description: 'Male, approximately 25-30 years old, wearing a black hoodie',
        isCustody: false,
      },
    });
  }

  const case2 = await prisma.case.upsert({
    where: { obNumber: 'OB/2024/001568' },
    update: {},
    create: {
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

  await prisma.oBEntry.upsert({
    where: { caseId: case2.id },
    update: {},
    create: {
      caseId: case2.id,
      entryNumber: 1568,
      stationId: centralStation.id,
      officerId: constable2.id,
      description: 'Traffic accident reported. Ambulance and traffic officers dispatched.',
    },
  });

  const case3 = await prisma.case.upsert({
    where: { obNumber: 'OB/2024/001569' },
    update: {},
    create: {
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

  await prisma.oBEntry.upsert({
    where: { caseId: case3.id },
    update: {},
    create: {
      caseId: case3.id,
      entryNumber: 1569,
      stationId: centralStation.id,
      officerId: sergeant.id,
      description: 'Domestic dispute resolved. Parties counseled and separated.',
    },
  });

  console.log('✓ Sample cases created');

  // ─────────────────────────────────────
  // TRAFFIC OFFENSES
  // ─────────────────────────────────────
  await prisma.trafficOffense.upsert({
    where: { offenseNumber: 'TO/2024/0001' },
    update: {},
    create: {
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

  await prisma.trafficOffense.upsert({
    where: { offenseNumber: 'TO/2024/0002' },
    update: {},
    create: {
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

  // ─────────────────────────────────────
  // ARMS REGISTRY
  // ─────────────────────────────────────
  const pistol1 = await prisma.weapon.upsert({
    where: { serialNumber: 'KPS-G17-001' },
    update: {},
    create: {
      stationId: centralStation.id,
      serialNumber: 'KPS-G17-001',
      weaponType: WeaponType.PISTOL,
      make: 'Glock',
      model: '17',
      caliber: '9mm',
      condition: WeaponCondition.SERVICEABLE,
      status: WeaponStatus.ASSIGNED,
      dateAcquired: new Date('2020-03-15'),
    },
  });

  await prisma.weapon.upsert({
    where: { serialNumber: 'KPS-G17-002' },
    update: {},
    create: {
      stationId: centralStation.id,
      serialNumber: 'KPS-G17-002',
      weaponType: WeaponType.PISTOL,
      make: 'Glock',
      model: '17',
      caliber: '9mm',
      condition: WeaponCondition.SERVICEABLE,
      status: WeaponStatus.IN_ARMORY,
      dateAcquired: new Date('2020-03-15'),
    },
  });

  await prisma.weapon.upsert({
    where: { serialNumber: 'KPS-AK-001' },
    update: {},
    create: {
      stationId: centralStation.id,
      serialNumber: 'KPS-AK-001',
      weaponType: WeaponType.RIFLE,
      make: 'Zastava',
      model: 'M70',
      caliber: '7.62x39mm',
      condition: WeaponCondition.SERVICEABLE,
      status: WeaponStatus.IN_ARMORY,
      dateAcquired: new Date('2018-07-01'),
    },
  });

  // Weapon assignment: pistol1 assigned to inspector (only if not already assigned)
  const existingAssignment = await prisma.weaponAssignment.findFirst({
    where: { weaponId: pistol1.id, officerId: inspector.id, isReturned: false },
  });
  if (!existingAssignment) {
    await prisma.weaponAssignment.create({
      data: {
        weaponId: pistol1.id,
        officerId: inspector.id,
        assignedById: ocs.id,
        purpose: 'Field patrol duty',
        isReturned: false,
      },
    });
  }

  // Civilian firearm license
  await prisma.civilianFirearm.upsert({
    where: { licenseNumber: 'LIC-NBI-2023-00145' },
    update: {},
    create: {
      ownerName: 'Robert Kariuki',
      ownerIdNumber: '24567890',
      ownerPhone: '+254-722-111222',
      ownerAddress: 'Karen, Nairobi',
      serialNumber: 'CIV-B92-00234',
      weaponType: WeaponType.PISTOL,
      make: 'Beretta',
      model: '92FS',
      caliber: '9mm',
      licenseNumber: 'LIC-NBI-2023-00145',
      licenseIssuedAt: new Date('2023-01-10'),
      licenseExpiresAt: new Date('2026-01-09'),
      stationId: centralStation.id,
    },
  });

  console.log('✓ Arms registry seeded');

  // ─────────────────────────────────────
  // NGAO OFFICERS
  // ─────────────────────────────────────
  const ngaoPassword = await bcrypt.hash('@Ngao26!', 12);

  // Chief for Kilimani Location
  await prisma.ngaoOfficer.upsert({
    where: { serviceId: 'NGAO-CHF-001' },
    update: { password: ngaoPassword },
    create: {
      name: 'Samuel Njoroge',
      nationalId: '10234567',
      serviceId: 'NGAO-CHF-001',
      role: NgaoRole.CHIEF,
      phone: '+254-711-001001',
      email: 'chief.kilimani@ngao.go.ke',
      password: ngaoPassword,
      locationId: kilimaniLocation.id,
    },
  });

  // Sub-Chief for Kilimani North Sub-Location
  await prisma.ngaoOfficer.upsert({
    where: { serviceId: 'NGAO-SC-001' },
    update: { password: ngaoPassword },
    create: {
      name: 'Agnes Wambui',
      nationalId: '20345678',
      serviceId: 'NGAO-SC-001',
      role: NgaoRole.SUB_CHIEF,
      phone: '+254-711-002002',
      email: 'subchief.kilinorth@ngao.go.ke',
      password: ngaoPassword,
      locationId: kilimaniLocation.id,
      subLocationId: kilimaniNorthSubLocation.id,
    },
  });

  // Assistant Chief
  await prisma.ngaoOfficer.upsert({
    where: { serviceId: 'NGAO-AC-001' },
    update: { password: ngaoPassword },
    create: {
      name: 'Daniel Otieno',
      nationalId: '30456789',
      serviceId: 'NGAO-AC-001',
      role: NgaoRole.ASSISTANT_CHIEF,
      phone: '+254-711-003003',
      email: 'ac.parklands@ngao.go.ke',
      password: ngaoPassword,
      locationId: parklandsLocation.id,
    },
  });

  // Sub-County Commissioner
  await prisma.ngaoOfficer.upsert({
    where: { serviceId: 'NGAO-SCC-001' },
    update: { password: ngaoPassword },
    create: {
      name: 'Grace Achieng',
      nationalId: '40567890',
      serviceId: 'NGAO-SCC-001',
      role: NgaoRole.SUB_COUNTY_COMMISSIONER,
      phone: '+254-711-004004',
      email: 'scc.westlands@ngao.go.ke',
      password: ngaoPassword,
      subCountyId: westlandsSubCounty.id,
    },
  });

  console.log('✓ NGAO officers seeded');

  // ─────────────────────────────────────
  // ACTIVITY LOGS & NOTIFICATIONS (skip if already seeded)
  // ─────────────────────────────────────
  const existingLog = await prisma.activityLog.findFirst({
    where: { userId: inspector.id, action: 'CASE_RESOLVED', entityId: case3.id },
  });
  if (!existingLog) {
    await prisma.activityLog.create({
      data: {
        userId: inspector.id,
        action: 'CASE_RESOLVED',
        entityType: 'CASE',
        entityId: case3.id,
        metadata: { obNumber: case3.obNumber, resolution: 'Parties counseled' },
      },
    });
    await prisma.activityLog.create({
      data: {
        userId: constable1.id,
        action: 'CREATE_CASE',
        entityType: 'CASE',
        entityId: case1.id,
        metadata: { obNumber: case1.obNumber },
      },
    });
    await prisma.notification.create({
      data: {
        userId: inspector.id,
        title: 'New Case Assigned',
        message: `Case ${case1.obNumber} has been assigned to you`,
        type: 'CASE_ASSIGNMENT',
        metadata: { caseId: case1.id, obNumber: case1.obNumber },
      },
    });
  }

  console.log('✓ Activity logs & notifications created');

  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('────────────────────────────────────────');
  console.log('POLICE OFFICERS');
  console.log('Inspector General:         IG-001   / Asqari26JeshReng23!');
  console.log('County Commander (NBI):    CC-001   / Asqari26JeshReng23!');
  console.log('OCS (Central):             OCS-001  / Asqari26JeshReng23!');
  console.log('Inspector:                 INS-001  / Asqari26JeshReng23!');
  console.log('Constable:                 PC-001   / Asqari26JeshReng23!');
  console.log('\nNGAO OFFICERS (login at /ngao/login)');
  console.log('Chief (Kilimani):          NGAO-CHF-001 / @Ngao26!');
  console.log('Sub-Chief (Kilimani N):    NGAO-SC-001  / @Ngao26!');
  console.log('Asst. Chief (Parklands):   NGAO-AC-001  / @Ngao26!');
  console.log('Sub-County Comm.:          NGAO-SCC-001 / @Ngao26!');
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
