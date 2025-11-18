import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApartmentDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  room: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  area: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  floor: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  totalFloors: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images?: any[];
}
