'use client'

import { Edit, Trash2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Apartment } from '@/lib/types/apartments'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ApartmentCardProps {
  apartment: Apartment
  onEdit: (apartment: Apartment) => void
  onDelete: (id: number) => void
}

export function AdminApartmentCard({
  apartment,
  onEdit,
  onDelete,
}: ApartmentCardProps) {
  const imageUrl = apartment.images?.[0]
    ? `${API_URL}/${apartment.images[0]}`
    : null

  return (
    <Card className="overflow-hidden border-border hover:shadow-md transition-shadow duration-200">
      <div className="h-48 bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Apartment ${apartment.room} rooms`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Home className="w-12 h-12 mb-2" />
            <p className="text-sm">No image</p>
          </div>
        )}
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {apartment.room} Room{apartment.room > 1 ? 's' : ''}
          </h3>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {apartment.area}m²
          </span>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Floor:</span>{' '}
            {apartment.floor} / {apartment.totalFloors}
          </p>

          {apartment.project && (
            <>
              <p>
                <span className="font-medium text-foreground">Project:</span>{' '}
                {apartment.project.projectName}
              </p>
              <p>
                <span className="font-medium text-foreground">Location:</span>{' '}
                {apartment.project.projectLocation}
              </p>
            </>
          )}

          {apartment.description && (
            <p className="text-xs line-clamp-2 mt-2">{apartment.description}</p>
          )}

          <p className="text-xs pt-2">
            <span className="font-medium">Images:</span>{' '}
            {apartment.images?.length || 0}
          </p>

          <p className="text-xs">
            <span className="font-medium">Created:</span>{' '}
            {new Date(apartment.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onEdit(apartment)}
            className="flex-1"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => onDelete(apartment.id)}
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
