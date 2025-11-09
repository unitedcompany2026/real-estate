import { useState } from 'react'
import { Building2, MapPin, Users, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

interface AdminProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (projectId: number) => void
  apiUrl?: string
}

export default function AdminProjectCard({
  project,
  onEdit,
  onDelete,
  apiUrl = 'http://localhost:3000',
}: AdminProjectCardProps) {
  const [imageError, setImageError] = useState<boolean>(false)

  const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null
    return imagePath.startsWith('http') ? imagePath : `${apiUrl}${imagePath}`
  }

  const handleDelete = (): void => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id)
    }
  }

  const imageUrl = getImageUrl(project.image)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={project.projectName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Image not available</p>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <Building2 className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-gray-800 flex-1">
            {project.projectName}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{project.projectLocation}</span>
        </div>

        {project.partner && (
          <div className="flex items-center gap-2 mb-3 text-sm text-blue-600">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{project.partner.companyName}</span>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4">
          Added: {new Date(project.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(project)}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
