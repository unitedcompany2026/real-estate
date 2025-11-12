import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateApartmentDto {
  @ApiProperty()
  room: number;

  @ApiProperty()
  area: number;

  @ApiProperty()
  floor: number;

  @ApiProperty()
  totalFloors: number;

  @ApiProperty()
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
