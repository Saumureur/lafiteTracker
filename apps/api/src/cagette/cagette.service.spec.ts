import { Test, TestingModule } from '@nestjs/testing';
import { CagetteService } from './cagette.service';

describe('CagetteService', () => {
  let service: CagetteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CagetteService],
    }).compile();

    service = module.get<CagetteService>(CagetteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
