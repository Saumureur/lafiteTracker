import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaletteDto } from './dto/create-palette.dto';

@Injectable()
export class PaletteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaletteDto: CreatePaletteDto, username: string, role: string) {
    return this.prisma.palette.create({
      data: {
        number: createPaletteDto.number,
        bonVendangeId: createPaletteDto.bonVendangeId,
        createdBy: username,
        createdWithRole: role,
        updatedBy: null,
        updatedWithRole: null,
      },
    });
  }
}