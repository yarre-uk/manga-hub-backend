/*
  Warnings:

  - Added the required column `aboba` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "aboba" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL;
