/*
  Warnings:

  - A unique constraint covering the columns `[number,bonVendangeId]` on the table `Cagette` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number,bonVendangeId]` on the table `Palette` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bonVendangeId` to the `Cagette` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Cagette] ADD [bonVendangeId] INT NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Cagette] ADD CONSTRAINT [Cagette_number_bonVendangeId_key] UNIQUE NONCLUSTERED ([number], [bonVendangeId]);

-- CreateIndex
ALTER TABLE [dbo].[Palette] ADD CONSTRAINT [Palette_number_bonVendangeId_key] UNIQUE NONCLUSTERED ([number], [bonVendangeId]);

-- AddForeignKey
ALTER TABLE [dbo].[Cagette] ADD CONSTRAINT [Cagette_bonVendangeId_fkey] FOREIGN KEY ([bonVendangeId]) REFERENCES [dbo].[BonVendange]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
