import { Test, TestingModule } from '@nestjs/testing';
import { PaletteService } from './palette.service';

describe('PaletteService', () => {
  let service: PaletteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaletteService],
    }).compile();

    service = module.get<PaletteService>(PaletteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
