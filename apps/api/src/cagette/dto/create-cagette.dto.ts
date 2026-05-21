import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCagetteDto {
  @ApiProperty({ 
    description: 'Le numéro scanné de la cagette', 
    example: 14 
  })
  @IsInt()
  @IsNotEmpty()
  number!: number;

  @ApiProperty({ 
    description: 'Le poids de la cagette en kg', 
    example: 12.5 
  })
  @IsNumber()
  @IsNotEmpty()
  poids!: number;

  @ApiProperty({ 
    description: 'L\'ID de la palette sur laquelle la cagette est posée', 
    example: 1 
  })
  @IsInt()
  @IsNotEmpty()
  paletteId!: number;

  @ApiProperty({ 
    description: 'L\'ID du bon de vendange pour garantir l\'unicité', 
    example: 1 
  })
  @IsInt()
  @IsNotEmpty()
  bonVendangeId!: number;
}