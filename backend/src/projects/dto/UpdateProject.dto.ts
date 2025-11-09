import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './CreateProject.dto';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  id: number;
}
