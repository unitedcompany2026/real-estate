import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpsertTranslationDto {
  @ApiProperty({
    example: 'ka',
    enum: ['en', 'ka', 'ru'],
    description: 'Language code',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['en', 'ka', 'ru'])
  language: string;

  @ApiProperty({
    example: 'ორბი გრუპი',
    description: 'Translated company name',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;
}
