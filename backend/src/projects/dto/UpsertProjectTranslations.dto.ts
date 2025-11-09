import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertProjectTranslationDto {
  @ApiProperty({ example: 'ka' })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ example: 'საცხოვრებელი კომპლექსი' })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({ example: 'თბილისი, საქართველო' })
  @IsString()
  @IsNotEmpty()
  projectLocation: string;
}
