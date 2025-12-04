// services/homepage-slides.service.ts
import { api } from '../api/api'
import type {
  HomepageSlide,
  HomepageSlideTranslation,
  UpsertSlideTranslationDto,
} from '../types/homepage-slides'

const BASE_URL = '/homepage-slides'

export const homepageSlidesService = {
  // Public endpoints
  getAll: (lang?: string) =>
    api.get<HomepageSlide[]>(BASE_URL, {
      params: { lang },
    }),

  getById: (id: number, lang?: string) =>
    api.get<HomepageSlide>(`${BASE_URL}/${id}`, {
      params: { lang },
    }),

  getTranslations: (id: number) =>
    api.get<HomepageSlideTranslation[]>(`${BASE_URL}/${id}/translations`),

  // Admin endpoints
  getAllAdmin: (lang?: string) =>
    api.get<HomepageSlide[]>(`${BASE_URL}/admin`, {
      params: { lang },
    }),

  createSlide: (data: FormData) =>
    api.post<HomepageSlide>(BASE_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateSlide: (id: number, data: FormData) =>
    api.patch<HomepageSlide>(`${BASE_URL}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteSlide: (id: number) =>
    api.delete<{ message: string; id: number }>(`${BASE_URL}/${id}`),

  upsertTranslation: (id: number, data: UpsertSlideTranslationDto) =>
    api.patch<HomepageSlideTranslation>(`${BASE_URL}/${id}/translations`, data),

  deleteTranslation: (id: number, language: string) =>
    api.delete<{ message: string }>(
      `${BASE_URL}/${id}/translations/${language}`
    ),
}
