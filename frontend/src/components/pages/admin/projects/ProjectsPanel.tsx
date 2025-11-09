import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useProjects, useDeleteProject } from '@/lib/hooks/useProjects'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Project } from '@/lib/types/projects'
import { EditProject } from './EditProject'
import { CreateProject } from './CreateProject'
import { AdminProjectCard } from './AdminProjectCard'

export default function ProjectsPanel() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentLang, setCurrentLang] = useState('en')

  const { data: projects, isLoading, error } = useProjects(currentLang)
  const deleteProject = useDeleteProject()

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setView('edit')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await deleteProject.mutateAsync(id)
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete project'
      )
    }
  }

  const handleBack = () => {
    setView('list')
    setSelectedProject(null)
  }

  if (view === 'create') {
    return <CreateProject onBack={handleBack} onSuccess={handleBack} />
  }

  if (view === 'edit' && selectedProject) {
    return (
      <EditProject
        project={selectedProject}
        onBack={handleBack}
        onSuccess={handleBack}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Construction Projects
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your construction projects and translations
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={currentLang} onValueChange={setCurrentLang}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ka">Georgian</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setView('create')}>
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </Button>
        </div>
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
            projects.map(project => (
              <AdminProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No projects found. Add your first project!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
