import { Test, TestingModule } from '@nestjs/testing';
import { BonVendangeController } from './bon-vendange.controller';
import { BonVendangeService } from './bon-vendange.service';

describe('BonVendangeController', () => {
  let controller: BonVendangeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonVendangeController],
      providers: [BonVendangeService],
    }).compile();

    controller = module.get<BonVendangeController>(BonVendangeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
