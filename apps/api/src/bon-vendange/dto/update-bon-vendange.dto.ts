import { PartialType } from '@nestjs/swagger';
import { CreateBonVendangeDto } from './create-bon-vendange.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateBonVendangeDto extends PartialType(CreateBonVendangeDto) {
  @IsOptional()
  @IsString()
  cuve?: string;

  @IsOptional()
  @IsIn(['EN_COURS', 'CLOTURE'])
  status?: string;
}