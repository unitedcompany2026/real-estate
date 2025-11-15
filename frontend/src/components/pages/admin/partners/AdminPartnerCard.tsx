import { Edit, Trash2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Partner } from '@/lib/types/partners'

const API_URL = 'http://localhost:3000'

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
    <Card className="flex items-center justify-between p-4 hover:shadow-sm transition">
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={partner.companyName}
            className="h-16 w-16 object-cover rounded-md bg-muted"
          />
        ) : (
          <div className="h-16 w-16 flex items-center justify-center rounded-md bg-muted">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-foreground">
            {partner.companyName}
          </h3>
          <p className="text-xs text-muted-foreground">
            Created: {new Date(partner.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(partner)}
          className="flex items-center gap-1"
        >
          <Edit className="w-4 h-4" /> Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(partner.id)}
          className="flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
