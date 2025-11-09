import type { Partner } from '../types/partners'
import { api } from '../api/api'
import { API_ENDPOINTS } from '@/constants/api'

export const partnersService = {
  getAll: () => api.get<Partner[]>(API_ENDPOINTS.PARTNERS.PARTNERS),

  createPartner: (data: FormData) =>
    api.post<Partner>(API_ENDPOINTS.PARTNERS.PARTNERS, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updatePartner: (data: FormData) =>
    api.patch<Partner>(API_ENDPOINTS.PARTNERS.PARTNERS, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deletePartner: (id: number) =>
    api.delete<{ message: string; id: number }>(
      API_ENDPOINTS.PARTNERS.PARTNERS,
      {
        data: { id },
      }
    ),
}
