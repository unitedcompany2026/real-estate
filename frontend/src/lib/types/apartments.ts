export interface Apartment {
  id: number
  room: number
  area: number
  images: string[]
  description: string | null
  createdAt: string
  project?: {
    id: number
    projectName: string
    projectLocation: string
    image?: string | null
    gallery?: string[]
    priceFrom?: number
    deliveryDate?: string | Date
    numFloors?: number
    numApartments?: number
  } | null
}

export interface ApartmentTranslation {
  id: number
  apartmentId: number
  language: string
  description: string | null
}

export interface ApartmentsResponse {
  data: Apartment[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface GetApartmentsParams {
  lang?: string
  page?: number
  limit?: number
  hotSale?: boolean
  projectId?: number
}

export interface UpsertTranslationDto {
  language: string
  description: string
}
