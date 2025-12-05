import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateMortgageRateDto {
  @ApiProperty({ example: 10.5, description: 'Interest rate percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  interestRate?: number;
}
