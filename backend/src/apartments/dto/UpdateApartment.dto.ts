import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateApartmentDto {
  @ApiPropertyOptional({ description: 'Number of rooms', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  room?: number;

  @ApiPropertyOptional({ description: 'Area in square meters', example: 85 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({ description: 'Project ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  projectId?: number;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description:
      'Additional apartment images (will be added to existing images)',
  })
  images?: any[];
}
