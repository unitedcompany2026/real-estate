import { useMutation, useQuery } from '@tanstack/react-query'
import {
  partnersService,
  type UpsertTranslationDto,
} from '../services/partners.service'
import { queryClient } from '../tanstack/query-client'
import type { Partner } from '../types/partners'

export const usePartners = (lang?: string) => {
  return useQuery<Partner[]>({
    queryKey: ['partners', lang],
    queryFn: async () => {
      const response = await partnersService.getAll(lang)
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
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await partnersService.updatePartner(id, data)
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

export const usePartnerTranslations = (id: number) => {
  return useQuery({
    queryKey: ['partners', id, 'translations'],
    queryFn: async () => {
      const response = await partnersService.getTranslations(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useUpsertTranslation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpsertTranslationDto
    }) => {
      const response = await partnersService.upsertTranslation(id, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['partners', variables.id, 'translations'],
      })
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}

export const useDeleteTranslation = () => {
  return useMutation({
    mutationFn: async ({ id, language }: { id: number; language: string }) => {
      const response = await partnersService.deleteTranslation(id, language)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['partners', variables.id, 'translations'],
      })
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}
