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
}