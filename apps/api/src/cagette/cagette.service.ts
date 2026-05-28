import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCagetteDto } from './dto/create-cagette.dto';
import { UpdateCagetteDto } from './dto/update-cagette.dto';

@Injectable()
export class CagetteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCagetteDto: CreateCagetteDto, username: string, role: string) {
    const existingCagette = await this.prisma.cagette.findFirst({
      where: {
        number: createCagetteDto.number,
        bonVendangeId: createCagetteDto.bonVendangeId,
      },
    });

    if (existingCagette) {
      throw new BadRequestException(
        `La cagette n°${createCagetteDto.number} a déjà été scannée dans ce bon de vendange !`
      );
    }

    return this.prisma.cagette.create({
      data: {
        number: createCagetteDto.number,
        poids: createCagetteDto.poids,
        paletteId: createCagetteDto.paletteId,
        bonVendangeId: createCagetteDto.bonVendangeId,

        createdBy: username,
        createdWithRole: role,
        updatedBy: null,
        updatedWithRole: null,
      },
    });
  }

  findAll() {
    return this.prisma.cagette.findMany();
  }

  async findOne(id: number) {
    const cagette = await this.prisma.cagette.findUnique({
      where: { id },
    });
    if (!cagette) {
      throw new NotFoundException(`La cagette #${id} est introuvable.`);
    }
    return cagette;
  }

  update(id: number, updateCagetteDto: UpdateCagetteDto, username: string, role: string) {
    return this.prisma.cagette.update({
      where: { id },
      data: {
        ...updateCagetteDto,
        createdBy: username,
        createdWithRole: role,
        updatedBy: null,
        updatedWithRole: null,
      }
    });
  }

  remove(id: number) {
    return this.prisma.cagette.delete({
      where: { id },
    });
  }
}