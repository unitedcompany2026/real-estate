import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHomepageSlideDto {
  @ApiProperty({
    description: 'Title of the slide (default language)',
    example: 'Find Your Dream Property',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Link URL for the slide',
    example: '/properties/123',
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({
    description: 'Order of the slide in the slideshow',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the slide is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Slide image file',
  })
  image: any;
}
