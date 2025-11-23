import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpsertPropertyUnitTranslationDto {
  @ApiProperty({
    description: 'Language code (e.g., en, ka, ru)',
    example: 'ka',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiPropertyOptional({
    description: 'Unit title in the specified language',
    example: 'მყუდრო 2-საძინებლიანი ბინა',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Unit description in the specified language',
    example: 'შესანიშნავია მცირე ოჯახებისთვის',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
