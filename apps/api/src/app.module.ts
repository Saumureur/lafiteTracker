import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StatusModule } from './status/status.module';
import { PaletteModule } from './palette/palette.module';
import { BonVendangeModule } from './bon-vendange/bon-vendange.module';
import { CagetteModule } from './cagette/cagette.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StatusModule,
    PaletteModule,
    BonVendangeModule,
    CagetteModule,
    AuthModule,
  ],
})
export class AppModule {}
