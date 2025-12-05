import { Edit, Trash2, ImageIcon, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Slide } from '@/lib/types/slides'

interface AdminSlideCardProps {
  slide: Slide
  onEdit: (slide: Slide) => void
  onDelete: (id: number) => void
}

export function AdminSlideCard({
  slide,
  onEdit,
  onDelete,
}: AdminSlideCardProps) {
  const imageUrl = slide.image
    ? `${import.meta.env.VITE_API_IMAGE_URL}/${slide.image}`
    : null

  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-border hover:bg-muted/30 transition">
      <div className="col-span-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={slide.title}
            className="h-16 w-full object-cover rounded-md bg-muted"
          />
        ) : (
          <div className="h-16 w-full flex items-center justify-center rounded-md bg-muted">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="col-span-3">
        <p className="font-medium text-foreground">{slide.title}</p>
      </div>

      <div className="col-span-2">
        {slide.link ? (
          <a
            href={slide.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span className="truncate max-w-[120px]">{slide.link}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">No link</span>
        )}
      </div>

      <div className="col-span-2">
        <span className="text-sm font-medium text-foreground">
          Order: {slide.order}
        </span>
      </div>

      <div className="col-span-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            slide.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {slide.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="col-span-1 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(slide)}
          className="h-8 w-8 p-0"
        >
          <Edit className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(slide.id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
