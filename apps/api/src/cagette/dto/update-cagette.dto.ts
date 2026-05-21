import { PartialType } from '@nestjs/swagger';
import { CreateCagetteDto } from './create-cagette.dto';

export class UpdateCagetteDto extends PartialType(CreateCagetteDto) {}
