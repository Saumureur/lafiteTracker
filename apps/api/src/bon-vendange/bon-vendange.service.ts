import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBonVendangeDto } from './dto/create-bon-vendange.dto';

@Injectable()
export class BonVendangeService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CRÉATION DU BON
  async create(createBonVendangeDto: CreateBonVendangeDto) {
    // Si l'opérateur ne fournit pas le millésime, on prend l'année actuelle par défaut
    const currentYear = new Date().getFullYear();

    return this.prisma.bonVendange.create({
      data: {
        remorque: createBonVendangeDto.remorque,
        parcelle: createBonVendangeDto.parcelle,
        millesime: createBonVendangeDto.millesime || currentYear,
        status: 'EN_COURS',
      },
    });
  }

  // 2. RÉCUPÉRER UN BON AVEC TOUT SON CONTENU (pour l'affichage frontend)
  async findOne(id: number) {
    const bon = await this.prisma.bonVendange.findUnique({
      where: { id },
      include: {
        palettes: {
          include: {
            cagettes: true, // On ramène aussi les cagettes pour faire la somme des poids en React
          },
        },
      },
    });

    if (!bon) {
      throw new NotFoundException(`Le bon #${id} n'existe pas.`);
    }
    return bon;
  }

  // 3. CLÔTURE DU BON
  async cloturer(id: number, cuve: string) {
    if (!cuve) {
      throw new BadRequestException("Impossible de clôturer : une cuve doit être associée.");
    }

    // On récupère le bon avec ses palettes et cagettes pour faire les vérifications
    const bon = await this.findOne(id);

    if (bon.status === 'CLOTURE') {
      throw new BadRequestException("Ce bon est déjà clôturé.");
    }

    if (bon.palettes.length === 0) {
      throw new BadRequestException("Impossible de clôturer un bon sans aucune palette.");
    }

    // Vérification stricte : chaque palette DOIT avoir 25 cagettes
    for (const palette of bon.palettes) {
      if (palette.cagettes.length !== 25) {
        throw new BadRequestException(
          `La palette n°${palette.number} contient ${palette.cagettes.length} cagette(s) au lieu de 25.`
        );
      }
    }

    // Si toutes les règles métier sont validées, on met à jour
    return this.prisma.bonVendange.update({
      where: { id },
      data: {
        status: 'CLOTURE',
        cuve: cuve,
      },
    });
  }
}