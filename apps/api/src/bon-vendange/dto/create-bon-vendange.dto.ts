import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateBonVendangeDto {
  @ApiProperty({ 
    description: 'Le nom ou numéro de la remorque', 
    example: 'Remorque 1' 
  })
  @IsString()
  @IsNotEmpty()
  remorque!: string;

  @ApiProperty({ 
    description: 'La parcelle de provenance', 
    example: 'Parcelle Nord' 
  })
  @IsString()
  @IsNotEmpty()
  parcelle!: string;

  @ApiProperty({ 
    description: 'Le millésime (généré par défaut si non fourni)', 
    example: 2026//, 
    //required: false 
  })
  @IsOptional()
  @IsInt()
  millesime?: number;

  @ApiProperty({
    description: 'Le sépage à choisir dans une liste',
    example: 'test'
  })
  @IsString()
  @IsNotEmpty()
  sepage!: string;
}