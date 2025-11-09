export interface Project {
  id: number
  projectName: string
  projectLocation: string
  image: string | null
  createdAt: string
  partnerId: number
  partner?: {
    id: number
    companyName: string
  }
}

export interface ProjectTranslation {
  id: number
  language: string
  projectName: string
  projectLocation: string
  projectId: number
}
