-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "CheckListItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "todoId" TEXT NOT NULL,

    CONSTRAINT "CheckListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckListItem_todoId_idx" ON "CheckListItem"("todoId");

-- CreateIndex
CREATE INDEX "CheckListItem_todoId_completed_idx" ON "CheckListItem"("todoId", "completed");

-- CreateIndex
CREATE INDEX "CheckListItem_todoId_order_idx" ON "CheckListItem"("todoId", "order");

-- CreateIndex
CREATE INDEX "Todo_userId_completed_idx" ON "Todo"("userId", "completed");

-- CreateIndex
CREATE INDEX "Todo_userId_dueDate_idx" ON "Todo"("userId", "dueDate");

-- CreateIndex
CREATE INDEX "Todo_userId_createdAt_idx" ON "Todo"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Todo_categoryId_idx" ON "Todo"("categoryId");

-- CreateIndex
CREATE INDEX "Todo_isPriority_idx" ON "Todo"("isPriority");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "CheckListItem" ADD CONSTRAINT "CheckListItem_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
