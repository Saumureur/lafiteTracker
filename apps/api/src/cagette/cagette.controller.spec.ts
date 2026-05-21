import { Test, TestingModule } from '@nestjs/testing';
import { CagetteController } from './cagette.controller';
import { CagetteService } from './cagette.service';

describe('CagetteController', () => {
  let controller: CagetteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CagetteController],
      providers: [CagetteService],
    }).compile();

    controller = module.get<CagetteController>(CagetteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
