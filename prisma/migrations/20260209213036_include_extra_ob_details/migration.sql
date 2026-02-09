/*
  Warnings:

  - You are about to drop the column `firstName` on the `Witness` table. All the data in the column will be lost.
  - You are about to drop the column `idNumber` on the `Witness` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Witness` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Witness` table. All the data in the column will be lost.
  - Added the required column `name` to the `Witness` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('FINE', 'BAIL', 'BOND');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'DEFERRED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MPESA', 'CARD', 'BANK_TRANSFER');

-- AlterTable
ALTER TABLE "Suspect" ADD COLUMN     "charges" TEXT;

-- AlterTable
ALTER TABLE "Witness" DROP COLUMN "firstName",
DROP COLUMN "idNumber",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ReportingPerson" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "idNumber" TEXT,
    "address" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportingPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemLost" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "estimatedValue" DECIMAL(12,2),
    "category" TEXT,
    "serialNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemLost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRecovered" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" TEXT,
    "locationFound" TEXT,
    "recoveredDate" TIMESTAMP(3),
    "evidenceTag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemRecovered_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "registrationNumber" TEXT NOT NULL,
    "color" TEXT,
    "year" INTEGER,
    "ownerName" TEXT,
    "ownerIdNumber" TEXT,
    "ownerContact" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellAdmission" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "suspectId" TEXT,
    "suspectName" TEXT NOT NULL,
    "cellNumber" TEXT NOT NULL,
    "admissionTime" TIMESTAMP(3) NOT NULL,
    "releaseTime" TIMESTAMP(3),
    "itemsAtCounter" TEXT,
    "reason" TEXT,
    "authorizedById" TEXT NOT NULL,
    "releaseAuthorizedById" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IN_CUSTODY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CellAdmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod",
    "transactionId" TEXT,
    "referenceNumber" TEXT,
    "paidAt" TIMESTAMP(3),
    "paidByName" TEXT,
    "paidByContact" TEXT,
    "processedById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportingPerson_caseId_idx" ON "ReportingPerson"("caseId");

-- CreateIndex
CREATE INDEX "ReportingPerson_idNumber_idx" ON "ReportingPerson"("idNumber");

-- CreateIndex
CREATE INDEX "ItemLost_caseId_idx" ON "ItemLost"("caseId");

-- CreateIndex
CREATE INDEX "ItemRecovered_caseId_idx" ON "ItemRecovered"("caseId");

-- CreateIndex
CREATE INDEX "Vehicle_caseId_idx" ON "Vehicle"("caseId");

-- CreateIndex
CREATE INDEX "Vehicle_registrationNumber_idx" ON "Vehicle"("registrationNumber");

-- CreateIndex
CREATE INDEX "CellAdmission_caseId_idx" ON "CellAdmission"("caseId");

-- CreateIndex
CREATE INDEX "CellAdmission_status_idx" ON "CellAdmission"("status");

-- CreateIndex
CREATE INDEX "CellAdmission_admissionTime_idx" ON "CellAdmission"("admissionTime");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_caseId_idx" ON "Payment"("caseId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- AddForeignKey
ALTER TABLE "ReportingPerson" ADD CONSTRAINT "ReportingPerson_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLost" ADD CONSTRAINT "ItemLost_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRecovered" ADD CONSTRAINT "ItemRecovered_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellAdmission" ADD CONSTRAINT "CellAdmission_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellAdmission" ADD CONSTRAINT "CellAdmission_suspectId_fkey" FOREIGN KEY ("suspectId") REFERENCES "Suspect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellAdmission" ADD CONSTRAINT "CellAdmission_authorizedById_fkey" FOREIGN KEY ("authorizedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellAdmission" ADD CONSTRAINT "CellAdmission_releaseAuthorizedById_fkey" FOREIGN KEY ("releaseAuthorizedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
