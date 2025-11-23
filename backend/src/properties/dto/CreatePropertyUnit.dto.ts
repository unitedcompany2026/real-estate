import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePropertyUnitDto {
  @ApiProperty({
    description: 'Unit number or identifier',
    example: 'A-101',
  })
  @IsString()
  @IsNotEmpty()
  unitNumber: string;

  @ApiPropertyOptional({
    description: 'Floor number',
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt()
  floor?: number;

  @ApiProperty({
    description: 'Unit area in sq meters',
    example: 85,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  area: number;

  @ApiPropertyOptional({
    description: 'Number of rooms',
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt()
  rooms?: number;

  @ApiPropertyOptional({
    description: 'Number of bedrooms',
    example: 2,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt()
  bedrooms?: number;

  @ApiPropertyOptional({
    description: 'Number of bathrooms',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt()
  bathrooms?: number;

  @ApiPropertyOptional({
    description: 'Unit price',
    example: 120000,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt()
  price?: number;

  @ApiPropertyOptional({
    description: 'Unit title (English)',
    example: 'Cozy 2-Bedroom Unit',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Unit description (English)',
    example: 'Perfect for small families',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Unit images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images?: any[];
}