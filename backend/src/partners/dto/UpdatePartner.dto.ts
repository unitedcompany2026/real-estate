import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdatePartnerDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Company logo image file',
    required: false,
  })
  @IsOptional()
  image?: any;
}
