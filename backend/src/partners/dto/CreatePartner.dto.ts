import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({
    example: 'Orbi Group',
    description: 'Name of the partner company',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Company logo image file',
    required: false,
  })
  @IsOptional()
  image?: any;
}
