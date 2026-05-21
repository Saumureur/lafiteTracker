import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaletteService } from './palette.service';
import { CreatePaletteDto } from './dto/create-palette.dto';

@ApiTags('Palettes')
@Controller('palette')
export class PaletteController {
  constructor(private readonly paletteService: PaletteService) {}

  @Post()
  @ApiOperation({ summary: 'Enregistrer une nouvelle palette scannée' })
  @ApiResponse({ status: 201, description: 'La palette a bien été sauvegardée en base de données.' })
  @ApiResponse({ status: 400, description: 'Données invalides (ex: number manquant ou mauvais format).' })
  async create(@Body() createPaletteDto: CreatePaletteDto) {
    return this.paletteService.create(createPaletteDto);
  }
}