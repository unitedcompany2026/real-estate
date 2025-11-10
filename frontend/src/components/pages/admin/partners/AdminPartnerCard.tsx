'use client'

import { Edit, Trash2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Partner } from '@/lib/types/partners'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface PartnerCardProps {
  partner: Partner
  onEdit: (partner: Partner) => void
  onDelete: (id: number) => void
}

export function AdminPartnerCard({
  partner,
  onEdit,
  onDelete,
}: PartnerCardProps) {
  const imageUrl = partner.image ? `${API_URL}/${partner.image}` : null

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="h-48 bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={partner.companyName}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
        )}
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground line-clamp-2">
            {partner.companyName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(partner.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onEdit(partner)}
            className="flex-1"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(partner.id)}
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
