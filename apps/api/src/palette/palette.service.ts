import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaletteDto } from './dto/create-palette.dto';

@Injectable()
export class PaletteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaletteDto: CreatePaletteDto) {
    return this.prisma.palette.create({
      data: {
        number: createPaletteDto.number,
        bonVendangeId: createPaletteDto.bonVendangeId,
      },
    });
  }
}