import { useState } from 'react'
import { Building2, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Partner {
  id: number
  companyName: string
  image: string | null
  createdAt: string
}

interface AdminPartnerCardProps {
  partner: Partner
  onEdit: (partner: Partner) => void
  onDelete: (partnerId: number) => void
  apiUrl?: string
}

export default function AdminPartnerCard({
  partner,
  onEdit,
  onDelete,
  apiUrl = 'http://localhost:3000',
}: AdminPartnerCardProps) {
  const [imageError, setImageError] = useState<boolean>(false)

  const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null
    return imagePath.startsWith('http') ? imagePath : `${apiUrl}${imagePath}`
  }

  const handleDelete = (): void => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      onDelete(partner.id)
    }
  }

  const imageUrl = getImageUrl(partner.image)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={partner.companyName}
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
          <Building2 className="w-5 h-5 text-gray-600 mt-0.5" />
          <h3 className="text-lg font-semibold text-gray-800 flex-1">
            {partner.companyName}
          </h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Added: {new Date(partner.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(partner)}
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
