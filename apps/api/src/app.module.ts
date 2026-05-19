import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatusModule } from './status/status.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StatusModule],
})
export class AppModule {}
