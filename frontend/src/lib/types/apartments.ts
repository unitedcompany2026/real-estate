export interface Apartment {
  id: number
  room: number
  area: number
  floor: number
  totalFloors: number
  images: string[]
  description: string | null
  createdAt: string
  project: {
    id: number
    projectName: string
    projectLocation: string
  }
}

export interface ApartmentTranslation {
  id: number
  apartmentId: number
  language: string
  description: string
}
