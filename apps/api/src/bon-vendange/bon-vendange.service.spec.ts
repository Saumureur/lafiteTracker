import { Test, TestingModule } from '@nestjs/testing';
import { BonVendangeService } from './bon-vendange.service';

describe('BonVendangeService', () => {
  let service: BonVendangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonVendangeService],
    }).compile();

    service = module.get<BonVendangeService>(BonVendangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
