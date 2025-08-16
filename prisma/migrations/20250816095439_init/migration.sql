-- CreateTable
CREATE TABLE "public"."status" (
    "status_id" INTEGER NOT NULL,
    "status_name" VARCHAR(30) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_status_name_key" ON "public"."status"("status_name");
