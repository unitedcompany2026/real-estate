import { Trash2, Upload, GripVertical, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface ApartmentImagesManagerProps {
  existingImages: string[]
  newFiles: File[]
  newPreviews: string[]
  onDeleteExisting: (index: number) => void
  onNewImagesChange: (files: File[], previews: string[]) => void
  onRemoveNew: (index: number) => void
  onExistingReorder: (newOrder: string[]) => void
  orderChanged: boolean
}

export function ApartmentImagesManager({
  existingImages,
  newFiles,
  newPreviews,
  onDeleteExisting,
  onNewImagesChange,
  onRemoveNew,
  onExistingReorder,
  orderChanged,
}: ApartmentImagesManagerProps) {
  const [draggedExistingIndex, setDraggedExistingIndex] = useState<
    number | null
  >(null)
  const [draggedNewIndex, setDraggedNewIndex] = useState<number | null>(null)

  // Drag handlers for existing images
  const handleExistingDragStart = (index: number) => {
    setDraggedExistingIndex(index)
  }

  const handleExistingDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedExistingIndex === null || draggedExistingIndex === index) return

    const newOrder = [...existingImages]
    const draggedImage = newOrder[draggedExistingIndex]

    newOrder.splice(draggedExistingIndex, 1)
    newOrder.splice(index, 0, draggedImage)

    onExistingReorder(newOrder)
    setDraggedExistingIndex(index)
  }

  const handleExistingDragEnd = () => {
    setDraggedExistingIndex(null)
  }

  // Drag handlers for new images
  const handleNewDragStart = (index: number) => {
    setDraggedNewIndex(index)
  }

  const handleNewDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedNewIndex === null || draggedNewIndex === index) return

    const newFilesArray = [...newFiles]
    const newPreviewsArray = [...newPreviews]

    const draggedFile = newFilesArray[draggedNewIndex]
    const draggedPreview = newPreviewsArray[draggedNewIndex]

    newFilesArray.splice(draggedNewIndex, 1)
    newFilesArray.splice(index, 0, draggedFile)

    newPreviewsArray.splice(draggedNewIndex, 1)
    newPreviewsArray.splice(index, 0, draggedPreview)

    onNewImagesChange(newFilesArray, newPreviewsArray)
    setDraggedNewIndex(index)
  }

  const handleNewDragEnd = () => {
    setDraggedNewIndex(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const updatedFiles = [...newFiles, ...files]
    const newPreviewsToAdd: string[] = []
    let loadedCount = 0

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviewsToAdd.push(reader.result as string)
        loadedCount++

        if (loadedCount === files.length) {
          onNewImagesChange(updatedFiles, [...newPreviews, ...newPreviewsToAdd])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Existing Images
          {orderChanged && (
            <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
              (Order changed - save to apply)
            </span>
          )}
        </Label>
        {existingImages && existingImages.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              💡 Drag images to reorder
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((img, index) => (
                <ExistingImageCard
                  key={index}
                  imageUrl={img}
                  index={index}
                  isDragging={draggedExistingIndex === index}
                  onDragStart={handleExistingDragStart}
                  onDragOver={handleExistingDragOver}
                  onDragEnd={handleExistingDragEnd}
                  onDelete={onDeleteExisting}
                />
              ))}
            </div>
          </>
        ) : (
          <Card className="border-dashed border-border bg-muted/20">
            <CardContent className="pt-12 pb-12 text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No images yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Add New Images
        </Label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/40 transition-colors relative bg-muted/30">
          <div className="py-2">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">
              Click to upload new images
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 5MB each
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {newPreviews.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mt-3">
              💡 Drag to reorder new images
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              {newPreviews.map((preview, index) => (
                <NewImageCard
                  key={index}
                  preview={preview}
                  index={index}
                  isDragging={draggedNewIndex === index}
                  onDragStart={handleNewDragStart}
                  onDragOver={handleNewDragOver}
                  onDragEnd={handleNewDragEnd}
                  onRemove={onRemoveNew}
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
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDelete,
}: {
  imageUrl: string
  index: number
  isDragging: boolean
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onDelete: (index: number) => void
}) {
  const handleDelete = async () => {
    if (!window.confirm('Delete this image permanently?')) return
    onDelete(index)
  }

  return (
    <Card
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`border-border overflow-hidden group cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="relative aspect-video">
        <img
          src={`${import.meta.env.VITE_API_IMAGE_URL}/${imageUrl}`}
          alt={`Image ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {index === 0 && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Main Photo
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          {index + 1}
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            className="h-10 w-10"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <CardContent className="p-2">
        <p className="text-xs text-muted-foreground text-center">
          Position: {index + 1}
        </p>
      </CardContent>
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
