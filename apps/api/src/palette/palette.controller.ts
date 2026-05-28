import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  async create(@Body() createPaletteDto: CreatePaletteDto, @Req() req: any) {
    const username = req.user.username
    const role = req.user.roles[0]
    return this.paletteService.create(createPaletteDto, username, role);
  }
}