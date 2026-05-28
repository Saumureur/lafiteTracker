BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[BonVendange] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [BonVendange_createdBy_df] DEFAULT 'Default',
[createdWithRole] NVARCHAR(1000) NOT NULL CONSTRAINT [BonVendange_createdWithRole_df] DEFAULT 'Default';

-- AlterTable
ALTER TABLE [dbo].[Cagette] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Cagette_createdBy_df] DEFAULT 'Default',
[createdWithRole] NVARCHAR(1000) NOT NULL CONSTRAINT [Cagette_createdWithRole_df] DEFAULT 'Default';

-- AlterTable
ALTER TABLE [dbo].[Palette] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Palette_createdBy_df] DEFAULT 'Default',
[createdWithRole] NVARCHAR(1000) NOT NULL CONSTRAINT [Palette_createdWithRole_df] DEFAULT 'Default';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
