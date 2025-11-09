import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  projectName: string;

  @IsString()
  projectLocation: string;

  @IsOptional()
  image?: any;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  partnerId: number;
}
