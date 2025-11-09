import { useMutation, useQuery } from '@tanstack/react-query'
import { partnersService } from '../services/partners.service'
import { queryClient } from '../tanstack/query-client'
import type { Partner } from '../types/partners'

export const usePartners = () => {
  return useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => {
      const response = await partnersService.getAll()
      return response.data
    },
  })
}

export const useCreatePartner = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await partnersService.createPartner(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}

export const useUpdatePartner = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await partnersService.updatePartner(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}

export const useDeletePartner = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await partnersService.deletePartner(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}
