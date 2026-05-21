import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePaletteDto {
  @ApiProperty({ 
    description: 'Le numéro de la palette scannée', 
    example: 1 
  })
  @IsInt()
  @IsNotEmpty()
  number!: number;

  @ApiProperty({ 
    description: 'L\'ID du bon de vendange auquel associer cette palette', 
    example: 1 
  })
  @IsInt()
  @IsNotEmpty()
  bonVendangeId!: number;
}