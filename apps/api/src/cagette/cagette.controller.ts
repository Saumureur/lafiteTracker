import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CagetteService } from './cagette.service';
import { CreateCagetteDto } from './dto/create-cagette.dto';
import { UpdateCagetteDto } from './dto/update-cagette.dto';

@Controller('cagette')
export class CagetteController {
  constructor(private readonly cagetteService: CagetteService) {}

  @Post()
  create(@Body() createCagetteDto: CreateCagetteDto) {
    return this.cagetteService.create(createCagetteDto);
  }

  @Get()
  findAll() {
    return this.cagetteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cagetteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCagetteDto: UpdateCagetteDto) {
    return this.cagetteService.update(+id, updateCagetteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cagetteService.remove(+id);
  }
}
