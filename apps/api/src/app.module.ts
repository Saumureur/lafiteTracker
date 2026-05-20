import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StatusModule } from './status/status.module';
import { PaletteModule } from './palette/palette.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StatusModule,
    PaletteModule,
  ],
})
export class AppModule {}
