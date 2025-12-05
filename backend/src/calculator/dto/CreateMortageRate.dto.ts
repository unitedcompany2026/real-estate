import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateMortgageRateDto {
  @ApiProperty({ example: 1, description: 'Starting year' })
  @IsInt()
  @Min(1)
  yearFrom: number;

  @ApiProperty({ example: 10, description: 'Ending year' })
  @IsInt()
  @Min(1)
  yearTo: number;

  @ApiProperty({ example: 10.5, description: 'Interest rate percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  interestRate: number;
}
