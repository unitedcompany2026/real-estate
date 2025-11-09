import { useState } from 'react'
import { Plus } from 'lucide-react'

import { usePartners } from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from '@/lib/hooks/useProjects'
import AdminProjectCard from './AdminProjectCard'
import CreateProjectModal from './CreateProjectModal'

const API_URL = 'http://localhost:3000'

interface Partner {
  id: number
  companyName: string
  image: string | null
  createdAt: string
}

interface Project {
  id: number
  projectName: string
  projectLocation: string
  image: string | null
  partnerId: number
  partner?: Partner
  createdAt: string
}

export default function ProjectsPanel() {
  const { data: projects, isLoading, error } = useProjects()
  const { data: partners, isLoading: partnersLoading } = usePartners()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleSaveProject = async (
    data: FormData,
    projectId?: number
  ): Promise<void> => {
    try {
      if (projectId) {
        // Just pass the FormData - it already contains the id
        await updateProject.mutateAsync(data)
      } else {
        await createProject.mutateAsync(data)
      }
      setIsModalOpen(false)
      setEditingProject(null)
    } catch (err) {
      console.error('Error saving project:', err)
    }
  }

  const handleEdit = (project: Project): void => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDelete = async (projectId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync(projectId)
      } catch (err) {
        console.error('Error deleting project:', err)
      }
    }
  }

  const handleAddNew = (): void => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Construction Projects
        </h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Error loading projects. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project: Project) => (
              <AdminProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                apiUrl={API_URL}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No projects found. Add your first project!
            </div>
          )}
        </div>
      )}

      <CreateProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveProject}
        isSubmitting={createProject.isPending || updateProject.isPending}
        editingProject={editingProject}
        partners={partners || []}
        partnersLoading={partnersLoading}
      />
    </>
  )
}
