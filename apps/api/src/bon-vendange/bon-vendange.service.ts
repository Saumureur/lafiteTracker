import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBonVendangeDto } from './dto/create-bon-vendange.dto';

@Injectable()
export class BonVendangeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBonVendangeDto: CreateBonVendangeDto, username: string, role: string) {
    const currentYear = new Date().getFullYear();

    return this.prisma.bonVendange.create({
      data: {
        remorque: createBonVendangeDto.remorque,
        parcelle: createBonVendangeDto.parcelle,
        millesime: createBonVendangeDto.millesime || currentYear,
        status: 'EN_COURS',
        sepage: createBonVendangeDto.sepage,
        createdBy: username,
        createdWithRole: role,

        updatedBy: null,
        updatedWithRole: null,

        logs: {
          create: {
            action: 'CREATION',
            details: 
              `Création du bon. Remorque: ${createBonVendangeDto.remorque}, Parcelle: ${createBonVendangeDto.parcelle}, 
              Millésime: ${createBonVendangeDto.millesime}, Sépage: ${createBonVendangeDto.sepage}`,
            username: username,
            role: role
          }
        }
      },
    });
  }

  async findOne(id: number) {
    const bon = await this.prisma.bonVendange.findUnique({
      where: { id },
      include: {
        palettes: {
          include: {
            cagettes: true, // On ramène aussi les cagettes pour faire la somme des poids en React
          },
        },
        logs: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!bon) {
      throw new NotFoundException(`Le bon #${id} n'existe pas.`);
    }
    return bon;
  }

  // METTRE À JOUR UN BON (Pour l'auto-save de la cuve)
  async update(id: number, updateData: { cuve?: string }, username: string, role: string) {
    return this.prisma.bonVendange.update({
      where: { id },
      data: {...updateData,
        logs: {
          create: {
            action: 'MODIFICATION',
            details: updateData.cuve ? `Affectation à la cuve : ${updateData.cuve}` : 'Modification des données',
            username: username,
            role: role
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.bonVendange.findMany({
      where: {
        status: 'EN_COURS', // Seuls les bons ouverts peuvent être complétés par l'opérateur
      },
      orderBy: {
        createdAt: 'desc', // Les plus récents en premier
      },
    });
  }

  // 3. CLÔTURE DU BON
  async cloturer(id: number, cuve: string, username: string, role: string) {
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
        logs: {
          create: {
            action: 'CLOTURER',
            details: 'Cloturer le bon',
            username: username,
            role: role
          }
        }
      },
    });
  }
}