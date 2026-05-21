import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste le chemin si besoin
import { CreateCagetteDto } from './dto/create-cagette.dto';
import { UpdateCagetteDto } from './dto/update-cagette.dto';

@Injectable()
export class CagetteService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CRÉATION (Avec la sécurité d'unicité)
  async create(createCagetteDto: CreateCagetteDto) {
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
      },
    });
  }

  // 2. RÉCUPÉRER TOUTES LES CAGETTES
  findAll() {
    return this.prisma.cagette.findMany();
  }

  // 3. RÉCUPÉRER UNE SEULE CAGETTE
  async findOne(id: number) {
    const cagette = await this.prisma.cagette.findUnique({
      where: { id },
    });
    if (!cagette) {
      throw new NotFoundException(`La cagette #${id} est introuvable.`);
    }
    return cagette;
  }

  // 4. METTRE À JOUR UNE CAGETTE (Crucial pour l'auto-save du poids !)
  update(id: number, updateCagetteDto: UpdateCagetteDto) {
    return this.prisma.cagette.update({
      where: { id },
      data: updateCagetteDto,
    });
  }

  // 5. SUPPRIMER UNE CAGETTE
  remove(id: number) {
    return this.prisma.cagette.delete({
      where: { id },
    });
  }
}