// src/services/calculator.service.ts
import { api } from '../api/api'
import type {
  MortgageRate,
  CalculateMortgageDto,
  MortgageCalculationResult,
  CreateMortgageRateDto,
  UpdateMortgageRateDto,
} from '../types/calculator'

const BASE_PATH = '/calculator'

export const calculatorService = {
  // Get all mortgage rates
  getAllRates: () => api.get<MortgageRate[]>(`${BASE_PATH}/rates`),

  // Calculate mortgage
  calculateMortgage: (data: CalculateMortgageDto) =>
    api.post<MortgageCalculationResult>(`${BASE_PATH}/calculate`, data),

  // Admin endpoints
  createRate: (data: CreateMortgageRateDto) =>
    api.post<MortgageRate>(`${BASE_PATH}/rates`, data),

  updateRate: (id: number, data: UpdateMortgageRateDto) =>
    api.patch<MortgageRate>(`${BASE_PATH}/rates/${id}`, data),

  deleteRate: (id: number) =>
    api.delete<{ message: string }>(`${BASE_PATH}/rates/${id}`),
}
