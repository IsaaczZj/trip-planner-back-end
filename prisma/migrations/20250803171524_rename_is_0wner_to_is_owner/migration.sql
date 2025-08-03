/*
  Warnings:

  - You are about to drop the column `is_0wner` on the `participants` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "trip_id" TEXT NOT NULL,
    CONSTRAINT "participants_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_participants" ("email", "id", "isConfirmed", "name", "trip_id") SELECT "email", "id", "isConfirmed", "name", "trip_id" FROM "participants";
DROP TABLE "participants";
ALTER TABLE "new_participants" RENAME TO "participants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
