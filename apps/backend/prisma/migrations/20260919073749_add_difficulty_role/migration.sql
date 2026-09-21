-- AlterTable
ALTER TABLE "InterviewSession" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'mid',
ADD COLUMN     "roleType" TEXT NOT NULL DEFAULT 'sde';
