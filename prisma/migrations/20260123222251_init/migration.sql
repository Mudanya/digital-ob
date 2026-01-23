-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'COUNTY_COMMANDER', 'OCPD', 'OCS', 'OCP', 'INSPECTOR', 'SERGEANT', 'CORPORAL', 'CONSTABLE', 'ADMIN');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('REPORTED', 'UNDER_INVESTIGATION', 'ASSIGNED_TO_DCI', 'ASSIGNED_TO_PROSECUTION', 'ASSIGNED_TO_ARBITRATION', 'COURT_FILED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "CasePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "CaseCategory" AS ENUM ('THEFT', 'ASSAULT', 'ROBBERY', 'MURDER', 'TRAFFIC', 'DOMESTIC', 'FRAUD', 'CYBERCRIME', 'NARCOTICS', 'OTHER');

-- CreateEnum
CREATE TYPE "DutyStatus" AS ENUM ('ON_DUTY', 'OFF_DUTY', 'LEAVE', 'SICK_LEAVE', 'TRAINING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "serviceNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "rank" TEXT NOT NULL,
    "stationId" TEXT,
    "countyId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "County" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "County_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countyId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "obNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "CaseCategory" NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'REPORTED',
    "priority" "CasePriority" NOT NULL DEFAULT 'MEDIUM',
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "reportedById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "stationId" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OBEntry" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "entryNumber" INTEGER NOT NULL,
    "stationId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "action" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OBEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suspect" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "idNumber" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "description" TEXT,
    "photo" TEXT,
    "arrestDate" TIMESTAMP(3),
    "isCustody" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suspect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Victim" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "idNumber" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "statement" TEXT,
    "medicalReport" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Victim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Witness" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "idNumber" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "statement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Witness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT,
    "collectedBy" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL,
    "chainOfCustody" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseUpdate" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "updateBy" TEXT NOT NULL,
    "updateType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficOffense" (
    "id" TEXT NOT NULL,
    "offenseNumber" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverIdNumber" TEXT,
    "driverLicense" TEXT,
    "vehicleReg" TEXT NOT NULL,
    "offenseType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "fineAmount" DOUBLE PRECISION,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "offenseDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrafficOffense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourtFile" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "courtName" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "filedById" TEXT NOT NULL,
    "filingDate" TIMESTAMP(3) NOT NULL,
    "hearingDate" TIMESTAMP(3),
    "verdict" TEXT,
    "status" TEXT NOT NULL DEFAULT 'FILED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourtFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DutyRoster" (
    "id" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "dutyDate" TIMESTAMP(3) NOT NULL,
    "shiftStart" TIMESTAMP(3) NOT NULL,
    "shiftEnd" TIMESTAMP(3) NOT NULL,
    "status" "DutyStatus" NOT NULL DEFAULT 'ON_DUTY',
    "assignment" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DutyRoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_serviceNumber_key" ON "User"("serviceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_serviceNumber_idx" ON "User"("serviceNumber");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_stationId_idx" ON "User"("stationId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "County_name_key" ON "County"("name");

-- CreateIndex
CREATE UNIQUE INDEX "County_code_key" ON "County"("code");

-- CreateIndex
CREATE INDEX "County_code_idx" ON "County"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Station_code_key" ON "Station"("code");

-- CreateIndex
CREATE INDEX "Station_code_idx" ON "Station"("code");

-- CreateIndex
CREATE INDEX "Station_countyId_idx" ON "Station"("countyId");

-- CreateIndex
CREATE UNIQUE INDEX "Case_obNumber_key" ON "Case"("obNumber");

-- CreateIndex
CREATE INDEX "Case_obNumber_idx" ON "Case"("obNumber");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "Case_priority_idx" ON "Case"("priority");

-- CreateIndex
CREATE INDEX "Case_stationId_idx" ON "Case"("stationId");

-- CreateIndex
CREATE INDEX "Case_reportedById_idx" ON "Case"("reportedById");

-- CreateIndex
CREATE INDEX "Case_assignedToId_idx" ON "Case"("assignedToId");

-- CreateIndex
CREATE UNIQUE INDEX "OBEntry_caseId_key" ON "OBEntry"("caseId");

-- CreateIndex
CREATE INDEX "OBEntry_stationId_entryNumber_idx" ON "OBEntry"("stationId", "entryNumber");

-- CreateIndex
CREATE INDEX "OBEntry_officerId_idx" ON "OBEntry"("officerId");

-- CreateIndex
CREATE INDEX "Suspect_caseId_idx" ON "Suspect"("caseId");

-- CreateIndex
CREATE INDEX "Suspect_idNumber_idx" ON "Suspect"("idNumber");

-- CreateIndex
CREATE INDEX "Victim_caseId_idx" ON "Victim"("caseId");

-- CreateIndex
CREATE INDEX "Witness_caseId_idx" ON "Witness"("caseId");

-- CreateIndex
CREATE INDEX "Evidence_caseId_idx" ON "Evidence"("caseId");

-- CreateIndex
CREATE INDEX "CaseUpdate_caseId_idx" ON "CaseUpdate"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "TrafficOffense_offenseNumber_key" ON "TrafficOffense"("offenseNumber");

-- CreateIndex
CREATE INDEX "TrafficOffense_offenseNumber_idx" ON "TrafficOffense"("offenseNumber");

-- CreateIndex
CREATE INDEX "TrafficOffense_vehicleReg_idx" ON "TrafficOffense"("vehicleReg");

-- CreateIndex
CREATE INDEX "TrafficOffense_officerId_idx" ON "TrafficOffense"("officerId");

-- CreateIndex
CREATE UNIQUE INDEX "CourtFile_caseNumber_key" ON "CourtFile"("caseNumber");

-- CreateIndex
CREATE INDEX "CourtFile_caseId_idx" ON "CourtFile"("caseId");

-- CreateIndex
CREATE INDEX "CourtFile_caseNumber_idx" ON "CourtFile"("caseNumber");

-- CreateIndex
CREATE INDEX "CourtFile_status_idx" ON "CourtFile"("status");

-- CreateIndex
CREATE INDEX "DutyRoster_officerId_dutyDate_idx" ON "DutyRoster"("officerId", "dutyDate");

-- CreateIndex
CREATE INDEX "DutyRoster_stationId_dutyDate_idx" ON "DutyRoster"("stationId", "dutyDate");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OBEntry" ADD CONSTRAINT "OBEntry_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OBEntry" ADD CONSTRAINT "OBEntry_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OBEntry" ADD CONSTRAINT "OBEntry_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suspect" ADD CONSTRAINT "Suspect_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Victim" ADD CONSTRAINT "Victim_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Witness" ADD CONSTRAINT "Witness_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseUpdate" ADD CONSTRAINT "CaseUpdate_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficOffense" ADD CONSTRAINT "TrafficOffense_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourtFile" ADD CONSTRAINT "CourtFile_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourtFile" ADD CONSTRAINT "CourtFile_filedById_fkey" FOREIGN KEY ("filedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DutyRoster" ADD CONSTRAINT "DutyRoster_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DutyRoster" ADD CONSTRAINT "DutyRoster_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
