import { Trash2, ImageIcon, Upload, GripVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface ProjectGalleryManagerProps {
  existingGallery: string[]
  deletedGalleryUrls: string[]
  newGalleryFiles: File[]
  newGalleryPreviews: string[]
  onExistingGalleryReorder: (newOrder: string[]) => void
  onMarkForDeletion: (url: string) => void
  onUndoDelete: (url: string) => void
  onNewGalleryChange: (files: File[], previews: string[]) => void
  onRemoveNewImage: (index: number) => void
  galleryOrderChanged: boolean
}

export function ProjectGalleryManager({
  existingGallery,
  deletedGalleryUrls,
  newGalleryFiles,
  newGalleryPreviews,
  onExistingGalleryReorder,
  onMarkForDeletion,
  onUndoDelete,
  onNewGalleryChange,
  onRemoveNewImage,
  galleryOrderChanged,
}: ProjectGalleryManagerProps) {
  const [draggedExistingIndex, setDraggedExistingIndex] = useState<
    number | null
  >(null)
  const [draggedNewIndex, setDraggedNewIndex] = useState<number | null>(null)

  // Drag handlers for existing gallery images
  const handleExistingDragStart = (index: number) => {
    setDraggedExistingIndex(index)
  }

  const handleExistingDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedExistingIndex === null || draggedExistingIndex === index) return

    const newOrder = [...existingGallery]
    const draggedUrl = newOrder[draggedExistingIndex]

    newOrder.splice(draggedExistingIndex, 1)
    newOrder.splice(index, 0, draggedUrl)

    onExistingGalleryReorder(newOrder)
    setDraggedExistingIndex(index)
  }

  const handleExistingDragEnd = () => {
    setDraggedExistingIndex(null)
  }

  // Drag handlers for new gallery images
  const handleNewDragStart = (index: number) => {
    setDraggedNewIndex(index)
  }

  const handleNewDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedNewIndex === null || draggedNewIndex === index) return

    const newFiles = [...newGalleryFiles]
    const newPreviews = [...newGalleryPreviews]

    const draggedFile = newFiles[draggedNewIndex]
    const draggedPreview = newPreviews[draggedNewIndex]

    newFiles.splice(draggedNewIndex, 1)
    newFiles.splice(index, 0, draggedFile)

    newPreviews.splice(draggedNewIndex, 1)
    newPreviews.splice(index, 0, draggedPreview)

    onNewGalleryChange(newFiles, newPreviews)
    setDraggedNewIndex(index)
  }

  const handleNewDragEnd = () => {
    setDraggedNewIndex(null)
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const newPreviews: string[] = []
      let loadedCount = 0

      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          loadedCount++

          if (loadedCount === files.length) {
            onNewGalleryChange(
              [...newGalleryFiles, ...files],
              [...newGalleryPreviews, ...newPreviews]
            )
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const displayGallery = existingGallery.filter(
    url => !deletedGalleryUrls.includes(url)
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Existing Gallery Images
          {galleryOrderChanged && (
            <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
              (Order changed - save to apply)
            </span>
          )}
        </Label>
        {existingGallery && existingGallery.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              💡 Drag images to reorder the gallery
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingGallery.map((img, index) => {
                const isMarkedForDeletion = deletedGalleryUrls.includes(img)
                return (
                  <ExistingImageCard
                    key={img}
                    imageUrl={img}
                    index={index}
                    isMarkedForDeletion={isMarkedForDeletion}
                    isDragging={draggedExistingIndex === index}
                    onDragStart={handleExistingDragStart}
                    onDragOver={handleExistingDragOver}
                    onDragEnd={handleExistingDragEnd}
                    onMarkForDeletion={onMarkForDeletion}
                    onUndoDelete={onUndoDelete}
                  />
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
            No gallery images yet
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Add New Gallery Images
        </Label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/40 transition-colors relative bg-muted/30">
          <div className="py-2">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">
              Click to upload multiple images
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 5MB each
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {newGalleryPreviews.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mt-3">
              💡 Drag to reorder new images
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              {newGalleryPreviews.map((preview, index) => (
                <NewImageCard
                  key={index}
                  preview={preview}
                  index={index}
                  isDragging={draggedNewIndex === index}
                  onDragStart={handleNewDragStart}
                  onDragOver={handleNewDragOver}
                  onDragEnd={handleNewDragEnd}
                  onRemove={onRemoveNewImage}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ExistingImageCard({
  imageUrl,
  index,
  isMarkedForDeletion,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onMarkForDeletion,
  onUndoDelete,
}: {
  imageUrl: string
  index: number
  isMarkedForDeletion: boolean
  isDragging: boolean
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onMarkForDeletion: (url: string) => void
  onUndoDelete: (url: string) => void
}) {
  return (
    <Card
      draggable={!isMarkedForDeletion}
      onDragStart={() => onDragStart(index)}
      onDragOver={e => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`border-border overflow-hidden group transition-opacity ${
        isMarkedForDeletion ? 'opacity-40 cursor-default' : 'cursor-move'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="relative aspect-video">
        <img
          src={`${import.meta.env.VITE_API_IMAGE_URL}/${imageUrl}`}
          alt={`Gallery ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {!isMarkedForDeletion && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <GripVertical className="w-3 h-3" />
            {index + 1}
          </div>
        )}
        {isMarkedForDeletion && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
            <span className="text-white text-xs font-medium">
              Marked for deletion
            </span>
          </div>
        )}
        {!isMarkedForDeletion && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onMarkForDeletion(imageUrl)}
              className="h-10 w-10"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
      {isMarkedForDeletion && (
        <CardContent className="p-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={() => onUndoDelete(imageUrl)}
          >
            Undo Delete
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

function NewImageCard({
  preview,
  index,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onRemove,
}: {
  preview: string
  index: number
  isDragging: boolean
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onRemove: (index: number) => void
}) {
  return (
    <Card
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 overflow-hidden group cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="relative aspect-video">
        <img
          src={preview}
          alt={`New ${index + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          New
        </div>
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          {index + 1}
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-10 w-10"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <CardContent className="p-2">
        <p className="text-xs text-center text-blue-900 dark:text-blue-100">
          Position: {index + 1}
        </p>
      </CardContent>
    </Card>
  )
}
