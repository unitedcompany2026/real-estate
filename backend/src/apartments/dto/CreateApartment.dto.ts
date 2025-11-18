import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApartmentDto {
  @ApiProperty({ description: 'Number of rooms', example: 2 })
  @Type(() => Number)
  @IsNumber()
  room: number;

  @ApiProperty({ description: 'Area in square meters', example: 85 })
  @Type(() => Number)
  @IsNumber()
  area: number;

  @ApiProperty({ description: 'Project ID', example: 1 })
  @Type(() => Number)
  @IsNumber()
  projectId: number;

  @ApiPropertyOptional({ description: 'Apartment description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Apartment images (max 10)',
  })
  images?: any[];
}
