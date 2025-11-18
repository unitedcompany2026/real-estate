// Update your @/lib/types/apartments.ts file

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
    image: string | null
    gallery?: string[]
    priceFrom?: number | null
    deliveryDate?: string | null
    numFloors?: number | null
    numApartments?: number | null
  }
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
