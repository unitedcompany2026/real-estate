'use client'

import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Project } from '@/lib/types/projects'

const API_URL = 'http://localhost:3000'

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
    <Card className="overflow-hidden border-border hover:shadow-md transition-shadow duration-200">
      <div className="h-48 bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={project.projectName}
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="text-muted-foreground text-sm">No image</p>
        )}
      </div>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {project.projectName}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Location:</span>{' '}
            {project.projectLocation}
          </p>

          {project.partner && (
            <p>
              <span className="font-medium text-foreground">Partner:</span>{' '}
              {project.partner.companyName}
            </p>
          )}

          <p className="text-xs">
            <span className="font-medium">Created:</span>{' '}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={() => onEdit(project)} className="flex-1" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(project.id)}
            size="icon"
            className="h-10 w-10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
