-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "hasDeadline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);
