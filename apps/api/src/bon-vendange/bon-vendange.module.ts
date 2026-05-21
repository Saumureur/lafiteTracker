import { Module } from '@nestjs/common';
import { BonVendangeService } from './bon-vendange.service';
import { BonVendangeController } from './bon-vendange.controller';

@Module({
  controllers: [BonVendangeController],
  providers: [BonVendangeService],
})
export class BonVendangeModule {}
