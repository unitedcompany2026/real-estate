import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProjects, useDeleteProject } from '@/lib/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { CreateProject } from './CreateProject'
import { EditProject } from './EditProject'
import { AdminProjectCard } from './AdminProjectCard'
import type { Project } from '@/lib/types/projects'
import Pagination from '@/components/shared/pagination/Pagination'

const PROJECTS_PER_PAGE = 6

 
 
export default function ProjectsPanel() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: projectsResponse, isLoading, error } = useProjects()
  const deleteProject = useDeleteProject()

  const projects = projectsResponse?.data || []

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const paginatedProjects = projects.slice(startIndex, endIndex)

  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setView('edit')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await deleteProject.mutateAsync(id)
      // Adjust current page if we deleted the last item on the page
      if (paginatedProjects.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-foreground">
            Construction Projects
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your construction projects
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Button
            onClick={() => setView('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Error loading projects. Please try again.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map(project => (
                <AdminProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No projects found. Add your first project!
              </div>
            )}
          </div>

          {projects.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          )}
        </>
      )}
    </div>
  )
}
