import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePropertyUnitDto {
  @ApiPropertyOptional({
    description: 'Unit number or identifier',
    example: 'A-101',
  })
  @IsOptional()
  @IsString()
  unitNumber?: string;

  @ApiPropertyOptional({
    description: 'Floor number',
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt()
  floor?: number;

  @ApiPropertyOptional({
    description: 'Unit area in sq meters',
    example: 85,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  area?: number;

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
    description: 'Additional unit images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images?: any[];
}
