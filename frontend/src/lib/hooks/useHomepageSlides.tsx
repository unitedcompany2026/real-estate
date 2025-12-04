// hooks/useHomepageSlides.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '../tanstack/query-client'
import type {
  HomepageSlide,
  HomepageSlideTranslation,
  UpsertSlideTranslationDto,
} from '../types/homepage-slides'
import { homepageSlidesService } from '../services/homepage-slides.service'
 

// Public hooks
export const useHomepageSlides = (lang?: string) => {
  return useQuery<HomepageSlide[]>({
    queryKey: ['homepage-slides', lang],
    queryFn: async () => {
      const response = await homepageSlidesService.getAll(lang)
      return response.data
    },
  })
}

export const useHomepageSlide = (id: number, lang?: string) => {
  return useQuery<HomepageSlide>({
    queryKey: ['homepage-slides', id, lang],
    queryFn: async () => {
      const response = await homepageSlidesService.getById(id, lang)
      return response.data
    },
    enabled: !!id,
  })
}

export const useSlideTranslations = (id: number) => {
  return useQuery<HomepageSlideTranslation[]>({
    queryKey: ['homepage-slides', id, 'translations'],
    queryFn: async () => {
      const response = await homepageSlidesService.getTranslations(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Admin hooks
export const useHomepageSlidesAdmin = (lang?: string) => {
  return useQuery<HomepageSlide[]>({
    queryKey: ['homepage-slides-admin', lang],
    queryFn: async () => {
      const response = await homepageSlidesService.getAllAdmin(lang)
      return response.data
    },
  })
}

export const useCreateSlide = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await homepageSlidesService.createSlide(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['homepage-slides-admin'] })
    },
  })
}

export const useUpdateSlide = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await homepageSlidesService.updateSlide(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['homepage-slides-admin'] })
    },
  })
}

export const useDeleteSlide = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await homepageSlidesService.deleteSlide(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['homepage-slides-admin'] })
    },
  })
}

export const useUpsertSlideTranslation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpsertSlideTranslationDto
    }) => {
      const response = await homepageSlidesService.upsertTranslation(id, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['homepage-slides', variables.id, 'translations'],
      })
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['homepage-slides-admin'] })
    },
  })
}

export const useDeleteSlideTranslation = () => {
  return useMutation({
    mutationFn: async ({ id, language }: { id: number; language: string }) => {
      const response = await homepageSlidesService.deleteTranslation(
        id,
        language
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['homepage-slides', variables.id, 'translations'],
      })
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['homepage-slides-admin'] })
    },
  })
}
