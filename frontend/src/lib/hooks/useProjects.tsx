import { useMutation, useQuery } from '@tanstack/react-query'
import { projectsService } from '../services/projects.service'
import { queryClient } from '../tanstack/query-client'
import type { Project } from '../types/projects'

/** Fetch all projects */
export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsService.getAll()
      return response.data
    },
  })
}

/** Fetch single project by ID */
export const useProject = (id: number) => {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await projectsService.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

/** Create new project */
export const useCreateProject = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await projectsService.createProject(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

/** Update existing project - id in FormData */
export const useUpdateProject = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await projectsService.updateProject(data)
      return response.data
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', data.id] })
    },
  })
}

/** Delete project - id in body */
export const useDeleteProject = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await projectsService.deleteProject(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
