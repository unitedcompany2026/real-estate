import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class CreatePartnerTranslationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  partnerId: number;

  @ApiProperty({ example: 'ka', enum: ['en', 'ka', 'ru'] })
  @IsString()
  @IsIn(['en', 'ka', 'ru'])
  language: string;

  @ApiProperty({ example: 'ორბი გრუპი' })
  @IsString()
  companyName: string;
}
