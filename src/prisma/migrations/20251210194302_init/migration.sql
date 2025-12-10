-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCheckedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "summonsNumber" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "violation" TEXT NOT NULL,
    "fineAmount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_summonsNumber_key" ON "Ticket"("summonsNumber");
