export interface HomepageSlide {
  id: number
  image: string
  title: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface HomepageSlideTranslation {
  id: number
  slideId: number
  language: string
  title: string
}

export interface UpsertSlideTranslationDto {
  language: string
  title: string
}
