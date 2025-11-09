import { Edit, Trash2, ImageIcon, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Project } from '@/lib/types/projects'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: number) => void
}

export function AdminProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const imageUrl = project.image ? `${API_URL}/${project.image}` : null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.projectName}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="w-16 h-16 text-gray-400" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {project.projectName}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {project.projectLocation}
          </div>

          {project.partner && (
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="w-4 h-4 mr-2" />
              {project.partner.companyName}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit(project)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(project.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
