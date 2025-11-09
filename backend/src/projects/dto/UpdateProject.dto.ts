import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Residential Complex' })
  @IsString()
  @IsOptional()
  projectName: string;
  @ApiProperty({ example: 'Tbilisi, Georgia', required: false })
  @IsString()
  @IsOptional()
  projectLocation?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  partnerId?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
