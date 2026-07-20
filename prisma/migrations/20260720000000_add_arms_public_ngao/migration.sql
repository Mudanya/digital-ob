-- ──────────────────────────────────────────────────────
-- New enums
-- ──────────────────────────────────────────────────────

CREATE TYPE "WeaponType" AS ENUM ('PISTOL', 'REVOLVER', 'RIFLE', 'SHOTGUN', 'SMG', 'SNIPER_RIFLE', 'GRENADE_LAUNCHER', 'OTHER');
CREATE TYPE "WeaponStatus" AS ENUM ('IN_ARMORY', 'ASSIGNED', 'LOST', 'DAMAGED', 'CONDEMNED', 'UNDER_REPAIR');
CREATE TYPE "WeaponCondition" AS ENUM ('SERVICEABLE', 'UNSERVICEABLE', 'NEEDS_REPAIR');
CREATE TYPE "NgaoRole" AS ENUM ('COUNTY_COMMISSIONER', 'SUB_COUNTY_COMMISSIONER', 'CHIEF', 'SUB_CHIEF', 'ASSISTANT_CHIEF', 'VILLAGE_ELDER');
CREATE TYPE "NgaoCommunityReportStatus" AS ENUM ('SUBMITTED', 'ACKNOWLEDGED', 'REFERRED_TO_POLICE', 'RESOLVED', 'CLOSED');

-- ──────────────────────────────────────────────────────
-- Geographic hierarchy
-- ──────────────────────────────────────────────────────

-- CreateTable Region
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- Seed the 8 Kenya Police regions so the County FK can be set
INSERT INTO "Region" ("id","name","code","updatedAt") VALUES
  ('rgn-nairobi',      'Nairobi',       'NBI-RGN',  NOW()),
  ('rgn-central',      'Central',       'CTL-RGN',  NOW()),
  ('rgn-eastern',      'Eastern',       'EST-RGN',  NOW()),
  ('rgn-north-eastern','North Eastern', 'NE-RGN',   NOW()),
  ('rgn-rift-valley',  'Rift Valley',   'RV-RGN',   NOW()),
  ('rgn-coast',        'Coast',         'CST-RGN',  NOW()),
  ('rgn-western',      'Western',       'WST-RGN',  NOW()),
  ('rgn-nyanza',       'Nyanza',        'NYZ-RGN',  NOW());

-- Add regionId as nullable first (avoids NOT NULL constraint error on existing rows)
ALTER TABLE "County" ADD COLUMN "regionId" TEXT;

-- Map existing counties to their regions using the old `region` string column
UPDATE "County" SET "regionId" = 'rgn-nairobi'  WHERE "region" = 'Nairobi';
UPDATE "County" SET "regionId" = 'rgn-central'  WHERE "region" = 'Central';
UPDATE "County" SET "regionId" = 'rgn-eastern'  WHERE "region" = 'Eastern';
UPDATE "County" SET "regionId" = 'rgn-north-eastern' WHERE "region" = 'North Eastern';
UPDATE "County" SET "regionId" = 'rgn-rift-valley'   WHERE "region" = 'Rift Valley';
UPDATE "County" SET "regionId" = 'rgn-coast'    WHERE "region" = 'Coast';
UPDATE "County" SET "regionId" = 'rgn-western'  WHERE "region" = 'Western';
UPDATE "County" SET "regionId" = 'rgn-nyanza'   WHERE "region" = 'Nyanza';

-- Any county that didn't match (unknown region string) falls back to Nairobi
UPDATE "County" SET "regionId" = 'rgn-nairobi' WHERE "regionId" IS NULL;

-- Now make it NOT NULL and add FK
ALTER TABLE "County" ALTER COLUMN "regionId" SET NOT NULL;
ALTER TABLE "County" ADD CONSTRAINT "County_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "County_regionId_idx" ON "County"("regionId");

-- Drop the old plain-text region column
ALTER TABLE "County" DROP COLUMN "region";

-- CreateTable SubCounty
CREATE TABLE "SubCounty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SubCounty_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SubCounty_code_key" ON "SubCounty"("code");
CREATE INDEX "SubCounty_countyId_idx" ON "SubCounty"("countyId");
ALTER TABLE "SubCounty" ADD CONSTRAINT "SubCounty_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable Location
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subCountyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Location_subCountyId_idx" ON "Location"("subCountyId");
ALTER TABLE "Location" ADD CONSTRAINT "Location_subCountyId_fkey" FOREIGN KEY ("subCountyId") REFERENCES "SubCounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable SubLocation
CREATE TABLE "SubLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SubLocation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SubLocation_locationId_idx" ON "SubLocation"("locationId");
ALTER TABLE "SubLocation" ADD CONSTRAINT "SubLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add subCountyId to Station (optional FK)
ALTER TABLE "Station" ADD COLUMN "subCountyId" TEXT;
ALTER TABLE "Station" ADD CONSTRAINT "Station_subCountyId_fkey" FOREIGN KEY ("subCountyId") REFERENCES "SubCounty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Station_subCountyId_idx" ON "Station"("subCountyId");

-- ──────────────────────────────────────────────────────
-- Arms Registry
-- ──────────────────────────────────────────────────────

-- CreateTable Weapon
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "weaponType" "WeaponType" NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT,
    "caliber" TEXT,
    "condition" "WeaponCondition" NOT NULL DEFAULT 'SERVICEABLE',
    "status" "WeaponStatus" NOT NULL DEFAULT 'IN_ARMORY',
    "dateAcquired" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Weapon_serialNumber_key" ON "Weapon"("serialNumber");
CREATE INDEX "Weapon_stationId_idx" ON "Weapon"("stationId");
CREATE INDEX "Weapon_serialNumber_idx" ON "Weapon"("serialNumber");
CREATE INDEX "Weapon_status_idx" ON "Weapon"("status");
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable WeaponAssignment
CREATE TABLE "WeaponAssignment" (
    "id" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),
    "returnedToId" TEXT,
    "purpose" TEXT,
    "notes" TEXT,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WeaponAssignment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "WeaponAssignment_weaponId_idx" ON "WeaponAssignment"("weaponId");
CREATE INDEX "WeaponAssignment_officerId_idx" ON "WeaponAssignment"("officerId");
CREATE INDEX "WeaponAssignment_isReturned_idx" ON "WeaponAssignment"("isReturned");
ALTER TABLE "WeaponAssignment" ADD CONSTRAINT "WeaponAssignment_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WeaponAssignment" ADD CONSTRAINT "WeaponAssignment_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WeaponAssignment" ADD CONSTRAINT "WeaponAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable CivilianFirearm
CREATE TABLE "CivilianFirearm" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerIdNumber" TEXT NOT NULL,
    "ownerPhone" TEXT,
    "ownerAddress" TEXT,
    "serialNumber" TEXT NOT NULL,
    "weaponType" "WeaponType" NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT,
    "caliber" TEXT,
    "licenseNumber" TEXT NOT NULL,
    "licenseIssuedAt" TIMESTAMP(3) NOT NULL,
    "licenseExpiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stationId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CivilianFirearm_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CivilianFirearm_serialNumber_key" ON "CivilianFirearm"("serialNumber");
CREATE UNIQUE INDEX "CivilianFirearm_licenseNumber_key" ON "CivilianFirearm"("licenseNumber");
CREATE INDEX "CivilianFirearm_ownerIdNumber_idx" ON "CivilianFirearm"("ownerIdNumber");
CREATE INDEX "CivilianFirearm_licenseNumber_idx" ON "CivilianFirearm"("licenseNumber");
CREATE INDEX "CivilianFirearm_stationId_idx" ON "CivilianFirearm"("stationId");
ALTER TABLE "CivilianFirearm" ADD CONSTRAINT "CivilianFirearm_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ──────────────────────────────────────────────────────
-- Public Case Tracking (audit trail)
-- ──────────────────────────────────────────────────────

CREATE TABLE "PublicLookupLog" (
    "id" TEXT NOT NULL,
    "obNumber" TEXT,
    "nationalId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PublicLookupLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PublicLookupLog_obNumber_idx" ON "PublicLookupLog"("obNumber");
CREATE INDEX "PublicLookupLog_createdAt_idx" ON "PublicLookupLog"("createdAt");

-- ──────────────────────────────────────────────────────
-- NGAO Portal
-- ──────────────────────────────────────────────────────

-- CreateTable NgaoOfficer
CREATE TABLE "NgaoOfficer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "role" "NgaoRole" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "subCountyId" TEXT,
    "locationId" TEXT,
    "subLocationId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "NgaoOfficer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NgaoOfficer_nationalId_key" ON "NgaoOfficer"("nationalId");
CREATE UNIQUE INDEX "NgaoOfficer_serviceId_key" ON "NgaoOfficer"("serviceId");
CREATE UNIQUE INDEX "NgaoOfficer_email_key" ON "NgaoOfficer"("email");
CREATE INDEX "NgaoOfficer_nationalId_idx" ON "NgaoOfficer"("nationalId");
CREATE INDEX "NgaoOfficer_role_idx" ON "NgaoOfficer"("role");
CREATE INDEX "NgaoOfficer_locationId_idx" ON "NgaoOfficer"("locationId");
ALTER TABLE "NgaoOfficer" ADD CONSTRAINT "NgaoOfficer_subCountyId_fkey" FOREIGN KEY ("subCountyId") REFERENCES "SubCounty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NgaoOfficer" ADD CONSTRAINT "NgaoOfficer_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NgaoOfficer" ADD CONSTRAINT "NgaoOfficer_subLocationId_fkey" FOREIGN KEY ("subLocationId") REFERENCES "SubLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable NgaoCommunityReport
CREATE TABLE "NgaoCommunityReport" (
    "id" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "CaseCategory" NOT NULL,
    "priority" "CasePriority" NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "NgaoCommunityReportStatus" NOT NULL DEFAULT 'SUBMITTED',
    "referredToStationId" TEXT,
    "relatedCaseId" TEXT,
    "acknowledgedById" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "NgaoCommunityReport_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "NgaoCommunityReport_reportedById_idx" ON "NgaoCommunityReport"("reportedById");
CREATE INDEX "NgaoCommunityReport_status_idx" ON "NgaoCommunityReport"("status");
CREATE INDEX "NgaoCommunityReport_referredToStationId_idx" ON "NgaoCommunityReport"("referredToStationId");
ALTER TABLE "NgaoCommunityReport" ADD CONSTRAINT "NgaoCommunityReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "NgaoOfficer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "NgaoCommunityReport" ADD CONSTRAINT "NgaoCommunityReport_referredToStationId_fkey" FOREIGN KEY ("referredToStationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NgaoCommunityReport" ADD CONSTRAINT "NgaoCommunityReport_relatedCaseId_fkey" FOREIGN KEY ("relatedCaseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable NgaoMessage
CREATE TABLE "NgaoMessage" (
    "id" TEXT NOT NULL,
    "fromNgaoId" TEXT,
    "fromOfficerId" TEXT,
    "toNgaoId" TEXT,
    "toOfficerId" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NgaoMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "NgaoMessage_fromNgaoId_idx" ON "NgaoMessage"("fromNgaoId");
CREATE INDEX "NgaoMessage_toNgaoId_idx" ON "NgaoMessage"("toNgaoId");
CREATE INDEX "NgaoMessage_toOfficerId_idx" ON "NgaoMessage"("toOfficerId");
CREATE INDEX "NgaoMessage_fromOfficerId_idx" ON "NgaoMessage"("fromOfficerId");
ALTER TABLE "NgaoMessage" ADD CONSTRAINT "NgaoMessage_fromNgaoId_fkey" FOREIGN KEY ("fromNgaoId") REFERENCES "NgaoOfficer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NgaoMessage" ADD CONSTRAINT "NgaoMessage_toNgaoId_fkey" FOREIGN KEY ("toNgaoId") REFERENCES "NgaoOfficer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
