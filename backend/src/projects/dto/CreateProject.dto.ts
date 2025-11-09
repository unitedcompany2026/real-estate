import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Residential Complex' })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({ example: 'Tbilisi, Georgia' })
  @IsString()
  @IsNotEmpty()
  projectLocation: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  partnerId: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
