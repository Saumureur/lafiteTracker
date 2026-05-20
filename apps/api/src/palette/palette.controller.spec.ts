import { Test, TestingModule } from '@nestjs/testing';
import { PaletteController } from './palette.controller';

describe('PaletteController', () => {
  let controller: PaletteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaletteController],
    }).compile();

    controller = module.get<PaletteController>(PaletteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
