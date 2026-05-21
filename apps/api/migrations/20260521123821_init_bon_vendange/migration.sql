/*
  Warnings:

  - Added the required column `bonVendangeId` to the `Palette` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Palette` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Palette] DROP CONSTRAINT [Palette_number_key];

-- AlterTable
ALTER TABLE [dbo].[Palette] ADD [bonVendangeId] INT NOT NULL,
[updatedAt] DATETIME2 NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[BonVendange] (
    [id] INT NOT NULL IDENTITY(1,1),
    [remorque] NVARCHAR(1000) NOT NULL,
    [parcelle] NVARCHAR(1000) NOT NULL,
    [millesime] INT NOT NULL,
    [cuve] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [BonVendange_status_df] DEFAULT 'EN_COURS',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BonVendange_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [BonVendange_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cagette] (
    [id] INT NOT NULL IDENTITY(1,1),
    [number] INT NOT NULL,
    [poids] FLOAT(53) NOT NULL,
    [paletteId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Cagette_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Cagette_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Palette] ADD CONSTRAINT [Palette_bonVendangeId_fkey] FOREIGN KEY ([bonVendangeId]) REFERENCES [dbo].[BonVendange]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cagette] ADD CONSTRAINT [Cagette_paletteId_fkey] FOREIGN KEY ([paletteId]) REFERENCES [dbo].[Palette]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
