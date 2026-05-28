import { Controller, Get, Post, UseGuards, Body, Patch, Param, ParseIntPipe, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { BonVendangeService } from './bon-vendange.service';
import { CreateBonVendangeDto } from './dto/create-bon-vendange.dto';

@ApiTags('Bons de Vendange')
@Controller('bon-vendange')
export class BonVendangeController {
  constructor(private readonly bonVendangeService: BonVendangeService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau bon de vendange' })
  @ApiResponse({ status: 201, description: 'Le bon a été créé.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  async create(@Body() createBonVendangeDto: CreateBonVendangeDto, @Req() req: any) {
    const username = req.user.username

    const role = req.user.roles[0]
    return this.bonVendangeService.create(createBonVendangeDto, username, role);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste des bons de vendange en cours' })
  @ApiResponse({ status: 200, description: 'Liste des bons récupérée.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  findAll() {
    return this.bonVendangeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un bon complet' })
  @ApiParam({ name: 'id', description: 'ID du bon de vendange' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bonVendangeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un bon (auto-save)' })
  @ApiParam({ name: 'id', description: 'ID du bon' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        cuve: { type: 'string', example: 'Cuve Inox A3' } 
      } 
    },
    description: 'Les champs à mettre à jour (ex: cuve)'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: { cuve?: string },
    @Req() req: any
  ) {
    const username = req.user.username
    const role = req.user.roles[0]
    return this.bonVendangeService.update(id, updateData, username, role);
  }

  @Patch(':id/cloturer')
  @ApiOperation({ summary: 'Clôturer un bon de vendange' })
  @ApiParam({ name: 'id', description: 'ID du bon de vendange à clôturer' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        cuve: { type: 'string', example: 'Cuve Inox A3' } 
      } 
    },
    description: 'Le nom de la cuve associée'
  })
  @ApiResponse({ status: 200, description: 'Le bon a été clôturé avec succès.' })
  @ApiResponse({ status: 400, description: 'Erreur métier (ex: manque de cagettes, cuve non fournie).' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  cloturer(
    @Param('id', ParseIntPipe) id: number,
    @Body('cuve') cuve: string,
    @Req() req: any
  ) {
    const username = req.user.username
    const role = req.user.roles[0]
    return this.bonVendangeService.cloturer(id, cuve, username, role);
  }
}