import { Controller, Get, Post, UseGuards, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CagetteService } from './cagette.service';
import { CreateCagetteDto } from './dto/create-cagette.dto';
import { UpdateCagetteDto } from './dto/update-cagette.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cagette')
export class CagetteController {
  constructor(private readonly cagetteService: CagetteService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  create(@Body() createCagetteDto: CreateCagetteDto, @Req() req: any) {
    const username = req.user.username
    const role = req.user.roles[0]
    return this.cagetteService.create(createCagetteDto, username, role);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  findAll() {
    return this.cagetteService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  findOne(@Param('id') id: string) {
    return this.cagetteService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  update(@Param('id') id: string, @Body() updateCagetteDto: UpdateCagetteDto, @Req() req: any) {
    const username = req.user.username
    const role = req.user.roles[0]
    return this.cagetteService.update(+id, updateCagetteDto, username, role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  remove(@Param('id') id: string) {
    return this.cagetteService.remove(+id);
  }
}
