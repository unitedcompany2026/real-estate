import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateApartmentDto {
  @ApiPropertyOptional()
  room?: number;

  @ApiPropertyOptional()
  area?: number;

  @ApiPropertyOptional()
  floor?: number;

  @ApiPropertyOptional()
  totalFloors?: number;

  @ApiPropertyOptional()
  projectId?: number;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images?: any[];
}
