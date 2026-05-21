import { Module } from '@nestjs/common';
import { CagetteService } from './cagette.service';
import { CagetteController } from './cagette.controller';

@Module({
  controllers: [CagetteController],
  providers: [CagetteService],
})
export class CagetteModule {}
