import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertSlideTranslationDto {
  @ApiProperty({
    description: 'Language code',
    example: 'ka',
  })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'Translated title',
    example: 'იპოვე შენი ოცნების ბინა',
  })
  @IsString()
  title: string;
}
