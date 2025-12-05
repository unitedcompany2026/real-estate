import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CalculateMortgageDto {
  @ApiProperty({ example: 100000, description: 'Property price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 60, description: 'Loan term in months' })
  @IsInt()
  @Min(1)
  months: number;

  @ApiProperty({
    example: 20000,
    description: 'Down payment amount',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  downPayment?: number;
}
