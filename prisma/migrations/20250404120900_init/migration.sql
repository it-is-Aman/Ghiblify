-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userID_key" ON "User"("userID");
