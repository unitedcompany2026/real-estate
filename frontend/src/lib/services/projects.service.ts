import { API_ENDPOINTS } from '@/constants/api'
import { api } from '../api/api'
import type { Project } from '../types/projects'

export const projectsService = {
  /** Get all projects */
  getAll: () => {
    return api.get<Project[]>(API_ENDPOINTS.PROJECTS.PROJECTS)
  },

  /** Get single project by ID */
  getById: (id: number) => {
    return api.get<Project>(`${API_ENDPOINTS.PROJECTS.PROJECTS}/${id}`)
  },

  /** Create new project */
  createProject: (data: FormData) => {
    return api.post<Project>(API_ENDPOINTS.PROJECTS.PROJECTS, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /** Update existing project - id in FormData body */
  updateProject: (data: FormData) => {
    return api.patch<Project>(API_ENDPOINTS.PROJECTS.PROJECTS, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /** Delete project - id in body */
  deleteProject: (id: number) => {
    return api.delete<{ message: string }>(API_ENDPOINTS.PROJECTS.PROJECTS, {
      data: { id },
    })
  },
}
