import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { StatusService } from './status.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('OPERATEUR')
  getStatus() {
    return this.statusService.getStatus();
  }
}
