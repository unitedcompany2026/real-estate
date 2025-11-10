import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images?: any[];
}
