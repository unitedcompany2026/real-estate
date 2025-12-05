import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '../tanstack/query-client'
import type {
  MortgageRate,
  CalculateMortgageDto,
  MortgageCalculationResult,
  CreateMortgageRateDto,
  UpdateMortgageRateDto,
} from '../types/calculator'
import { calculatorService } from '../services/calculator.service'

export const useMortgageRates = () => {
  return useQuery<MortgageRate[]>({
    queryKey: ['mortgage-rates'],
    queryFn: async () => {
      const response = await calculatorService.getAllRates()
      return response.data
    },
  })
}

export const useCalculateMortgage = () => {
  return useMutation<MortgageCalculationResult, Error, CalculateMortgageDto>({
    mutationFn: async data => {
      const response = await calculatorService.calculateMortgage(data)
      return response.data
    },
  })
}

export const useCreateMortgageRate = () => {
  return useMutation({
    mutationFn: async (data: CreateMortgageRateDto) => {
      const response = await calculatorService.createRate(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mortgage-rates'] })
    },
  })
}

export const useUpdateMortgageRate = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateMortgageRateDto
    }) => {
      const response = await calculatorService.updateRate(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mortgage-rates'] })
    },
  })
}

export const useDeleteMortgageRate = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await calculatorService.deleteRate(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mortgage-rates'] })
    },
  })
}
