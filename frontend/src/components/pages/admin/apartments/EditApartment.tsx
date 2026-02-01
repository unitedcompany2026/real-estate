import { useState, useEffect } from 'react'
import { X, Save, LayoutTemplate, Languages, Upload } from 'lucide-react'
import {
  useUpdateApartment,
  useDeleteApartmentImage,
  useApartment,
} from '@/lib/hooks/useApartments'
import { useProjects } from '@/lib/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { ApartmentTranslationsManager } from './ApartmentTranslationsManager'

import type { Apartment } from '@/lib/types/apartments'
import { ApartmentImagesManager } from './ApartmentimagesManager'

interface EditApartmentProps {
  apartment: Apartment
  onBack: () => void
  onSuccess: () => void
}

export function EditApartment({
  apartment: initialData,
  onBack,
  onSuccess,
}: EditApartmentProps) {
  const { data: freshData } = useApartment(initialData.id)
  const apartment = freshData || initialData

  const [formData, setFormData] = useState({
    projectId: apartment.project?.id.toString() || '',
    room: apartment.room.toString(),
    area: apartment.area.toString(),
  })

  const [existingImages, setExistingImages] = useState<string[]>(
    apartment.images || []
  )
  const [originalImages, setOriginalImages] = useState<string[]>(
    apartment.images || []
  )

  const [images, setImages] = useState({
    newFiles: [] as File[],
    previews: [] as string[],
  })

  const [activeSection, setActiveSection] = useState<
    'details' | 'images' | 'translations'
  >('details')

  // Update existing images when apartment data changes
  useEffect(() => {
    if (apartment.images) {
      setExistingImages(apartment.images)
      setOriginalImages(apartment.images)
    }
  }, [apartment.images])

  const updateApartment = useUpdateApartment()
  const deleteImage = useDeleteApartmentImage()
  const { data: projectsResponse } = useProjects()
  const projects = projectsResponse?.data || []

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDeleteExistingImage = async (index: number) => {
    try {
      await deleteImage.mutateAsync({ id: apartment.id, imageIndex: index })
      // Update local state after successful deletion
      setExistingImages(prev => prev.filter((_, i) => i !== index))
      setOriginalImages(prev => prev.filter((_, i) => i !== index))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    const data = new FormData()
    let hasUpdates = false

    if (formData.room !== apartment.room.toString()) {
      data.append('room', formData.room)
      hasUpdates = true
    }
    if (formData.area !== apartment.area.toString()) {
      data.append('area', formData.area)
      hasUpdates = true
    }

    if (
      formData.projectId &&
      formData.projectId !== (apartment.project?.id.toString() || '')
    ) {
      data.append('projectId', formData.projectId)
      hasUpdates = true
    }

    // Check if image order changed
    const imageOrderChanged =
      existingImages.length !== originalImages.length ||
      existingImages.some((img, idx) => img !== originalImages[idx])

    if (imageOrderChanged) {
      data.append('imageOrder', JSON.stringify(existingImages))
      hasUpdates = true
    }

    if (images.newFiles.length > 0) {
      images.newFiles.forEach(file => data.append('images', file))
      hasUpdates = true
    }

    if (!hasUpdates) {
      onSuccess()
      return
    }

    try {
      await updateApartment.mutateAsync({ id: apartment.id, data })
      onSuccess()
    } catch (err) {
      console.error(err)
    }
  }

  const imageOrderChanged =
    existingImages.length !== originalImages.length ||
    existingImages.some((img, idx) => img !== originalImages[idx])

  const hasChanges =
    formData.room !== apartment.room.toString() ||
    formData.area !== apartment.area.toString() ||
    (formData.projectId &&
      formData.projectId !== (apartment.project?.id.toString() || '')) ||
    images.newFiles.length > 0 ||
    imageOrderChanged

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm p-8 mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
            Edit Apartment{' '}
            <span className="text-muted-foreground text-lg font-normal">
              #{apartment.id}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {apartment.project?.projectName} • {apartment.room} Rooms •{' '}
            {apartment.area}m²
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border w-full overflow-x-auto">
        <button
          onClick={() => setActiveSection('details')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'details'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutTemplate className="w-4 h-4 inline mr-2" />
          Details
        </button>
        <button
          onClick={() => setActiveSection('images')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'images'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Images ({existingImages.length + images.newFiles.length})
        </button>
        <button
          onClick={() => setActiveSection('translations')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'translations'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Languages className="w-4 h-4 inline mr-2" />
          Translations
        </button>
      </div>

      {hasChanges && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            You have unsaved changes. Click "Save Changes" to apply them.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {activeSection === 'details' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="projectId"
                className="text-sm font-medium text-foreground"
              >
                Project Assignment
              </Label>
              <Select
                value={formData.projectId}
                onValueChange={value => updateFormField('projectId', value)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.projectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Number of Rooms</Label>
                <Input
                  id="room"
                  type="number"
                  min="1"
                  value={formData.room}
                  onChange={e => updateFormField('room', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.area}
                  onChange={e => updateFormField('area', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={updateApartment.isPending || !hasChanges}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateApartment.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="px-6 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {activeSection === 'images' && (
          <div className="space-y-4">
            <ApartmentImagesManager
              existingImages={existingImages}
              newFiles={images.newFiles}
              newPreviews={images.previews}
              onDeleteExisting={handleDeleteExistingImage}
              onNewImagesChange={(files, previews) =>
                setImages({ newFiles: files, previews })
              }
              onRemoveNew={index =>
                setImages(prev => ({
                  newFiles: prev.newFiles.filter((_, i) => i !== index),
                  previews: prev.previews.filter((_, i) => i !== index),
                }))
              }
              onExistingReorder={setExistingImages}
              orderChanged={imageOrderChanged}
            />

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={updateApartment.isPending || !hasChanges}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateApartment.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="px-6 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {activeSection === 'translations' && (
          <ApartmentTranslationsManager apartmentId={apartment.id} />
        )}
      </div>
    </div>
  )
}
