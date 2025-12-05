import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMortgageRateDto } from './dto/CreateMortageRate.dto';
import { UpdateMortgageRateDto } from './dto/UpdateMortageRate.dto';
import { CalculateMortgageDto } from './dto/CalculatorMortage.dto';

@Injectable()
export class CalculatorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRates() {
    return this.prisma.mortgageRate.findMany({
      where: { isActive: true },
      orderBy: { yearFrom: 'asc' },
    });
  }

  async createRate(dto: CreateMortgageRateDto) {
    const existing = await this.prisma.mortgageRate.findFirst({
      where: {
        yearFrom: dto.yearFrom,
        yearTo: dto.yearTo,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Rate for year range ${dto.yearFrom}-${dto.yearTo} already exists`,
      );
    }

    if (dto.yearFrom >= dto.yearTo) {
      throw new ConflictException('yearFrom must be less than yearTo');
    }

    return this.prisma.mortgageRate.create({
      data: dto,
    });
  }

  async updateRate(id: number, dto: UpdateMortgageRateDto) {
    const rate = await this.prisma.mortgageRate.findUnique({
      where: { id },
    });

    if (!rate) {
      throw new NotFoundException(`Mortgage rate with ID ${id} not found`);
    }

    return this.prisma.mortgageRate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRate(id: number) {
    const rate = await this.prisma.mortgageRate.findUnique({
      where: { id },
    });

    if (!rate) {
      throw new NotFoundException(`Mortgage rate with ID ${id} not found`);
    }

    await this.prisma.mortgageRate.delete({
      where: { id },
    });

    return { message: 'Mortgage rate deleted successfully' };
  }

  async calculateMortgage(dto: CalculateMortgageDto) {
    const { price, months, downPayment = 0 } = dto;

    const loanAmount = price - downPayment;

    if (loanAmount <= 0) {
      return {
        loanAmount: 0,
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        interestRate: 0,
        months,
      };
    }

    const years = Math.ceil(months / 12);

    const rate = await this.prisma.mortgageRate.findFirst({
      where: {
        isActive: true,
        yearFrom: { lte: years },
        yearTo: { gte: years },
      },
    });

    if (!rate) {
      throw new NotFoundException(
        `No interest rate found for ${years} year(s) loan term`,
      );
    }

    const monthlyRate = rate.interestRate / 12 / 100;
    const denominator = Math.pow(1 + monthlyRate, months) - 1;

    let monthlyPayment: number;

    if (denominator === 0) {
      monthlyPayment = loanAmount / months;
    } else {
      monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        denominator;
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;

    return {
      loanAmount: Math.round(loanAmount * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      interestRate: rate.interestRate,
      months,
      downPayment,
      price,
    };
  }
}
