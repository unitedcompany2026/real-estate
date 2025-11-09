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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={partner.companyName}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="w-16 h-16 text-gray-400" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {partner.companyName}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Created: {new Date(partner.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit(partner)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(partner.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
