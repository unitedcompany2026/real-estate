import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpsertPropertyTranslationDto {
  @ApiProperty({
    description: 'Language code (e.g., en, ka, ru)',
    example: 'ka',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    description: 'Property title in the specified language',
    example: 'ლუქსუსური ბინა',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Property description in the specified language',
    example: 'ულამაზესი ბინა ზღვის ხედით',
  })
  @IsOptional()
  @IsString()
  description?: string;
}