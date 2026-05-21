import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BonVendangeService } from './bon-vendange.service';
import { CreateBonVendangeDto } from './dto/create-bon-vendange.dto';

@ApiTags('Bons de Vendange')
@Controller('bon-vendange')
export class BonVendangeController {
  constructor(private readonly bonVendangeService: BonVendangeService) {}

  // 1. ROUTE DE CRÉATION
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau bon de vendange' })
  @ApiResponse({ status: 201, description: 'Le bon a été créé.' })
  create(@Body() createBonVendangeDto: CreateBonVendangeDto) {
    return this.bonVendangeService.create(createBonVendangeDto);
  }

  // 2. ROUTE POUR RÉCUPÉRER UN BON (avec ses palettes et cagettes)
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un bon complet' })
  @ApiParam({ name: 'id', description: 'ID du bon de vendange' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bonVendangeService.findOne(id);
  }

  // 3. LA ROUTE POUR CLÔTURER
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
  cloturer(
    @Param('id', ParseIntPipe) id: number,
    @Body('cuve') cuve: string,
  ) {
    return this.bonVendangeService.cloturer(id, cuve);
  }
}