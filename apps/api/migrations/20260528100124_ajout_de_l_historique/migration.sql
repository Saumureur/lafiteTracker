BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[BonVendange] DROP CONSTRAINT [BonVendange_createdBy_df],
[BonVendange_createdWithRole_df];
ALTER TABLE [dbo].[BonVendange] ADD [updatedBy] NVARCHAR(1000),
[updatedWithRole] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Cagette] DROP CONSTRAINT [Cagette_createdBy_df],
[Cagette_createdWithRole_df];
ALTER TABLE [dbo].[Cagette] ADD [updatedBy] NVARCHAR(1000),
[updatedWithRole] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Palette] DROP CONSTRAINT [Palette_createdBy_df],
[Palette_createdWithRole_df];
ALTER TABLE [dbo].[Palette] ADD [updatedBy] NVARCHAR(1000),
[updatedWithRole] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[HistoriqueBon] (
    [id] INT NOT NULL IDENTITY(1,1),
    [action] NVARCHAR(1000) NOT NULL,
    [details] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [HistoriqueBon_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [username] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [bonVendangeId] INT NOT NULL,
    CONSTRAINT [HistoriqueBon_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[HistoriqueBon] ADD CONSTRAINT [HistoriqueBon_bonVendangeId_fkey] FOREIGN KEY ([bonVendangeId]) REFERENCES [dbo].[BonVendange]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
