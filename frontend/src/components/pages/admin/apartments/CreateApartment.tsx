import type React from 'react'
import { useState } from 'react'
import { X, Save, ImagePlus } from 'lucide-react'
import { useCreateApartment } from '@/lib/hooks/useApartments'
import { useProjects } from '@/lib/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface CreateApartmentProps {
  onBack: () => void
  onSuccess: () => void
}

export function CreateApartment({ onBack, onSuccess }: CreateApartmentProps) {
  const [formData, setFormData] = useState({
    room: '',
    area: '',
    description: '',
    projectId: '',
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createApartment = useCreateApartment()
  const { data: projectsResponse } = useProjects()
  const projects = projectsResponse?.data || []

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newFiles = [...imageFiles, ...files]
    setImageFiles(newFiles)

    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.room || Number(formData.room) <= 0) {
      newErrors.room = 'Valid number of rooms is required'
    }
    if (!formData.area || Number(formData.area) <= 0) {
      newErrors.area = 'Valid area is required'
    }
    if (!formData.projectId) {
      newErrors.projectId = 'Project selection is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const data = new FormData()
    data.append('room', formData.room)
    data.append('area', formData.area)
    data.append('projectId', formData.projectId)

    if (formData.description.trim()) {
      data.append('description', formData.description)
    }

    imageFiles.forEach(file => {
      data.append('images', file)
    })

    try {
      await createApartment.mutateAsync(data)
      onSuccess()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create apartment' })
    }
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Create Apartment
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new apartment to your project
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="room"
              className="text-sm font-medium text-foreground"
            >
              Number of Rooms <span className="text-red-500">*</span>
            </Label>
            <Input
              id="room"
              type="number"
              min="1"
              value={formData.room}
              onChange={e => setFormData({ ...formData, room: e.target.value })}
              placeholder="e.g., 2"
              className={`bg-background border ${errors.room ? 'border-red-500' : 'border-border'}`}
            />
            {errors.room && (
              <p className="text-red-500 text-sm font-medium">{errors.room}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="area"
              className="text-sm font-medium text-foreground"
            >
              Area (m²) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="area"
              type="number"
              min="1"
              step="0.01"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: e.target.value })}
              placeholder="e.g., 85.5"
              className={`bg-background border ${errors.area ? 'border-red-500' : 'border-border'}`}
            />
            {errors.area && (
              <p className="text-red-500 text-sm font-medium">{errors.area}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="projectId"
            className="text-sm font-medium text-foreground"
          >
            Project <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.projectId}
            onValueChange={value =>
              setFormData({ ...formData, projectId: value })
            }
          >
            <SelectTrigger
              className={`bg-background border ${errors.projectId ? 'border-red-500' : 'border-border'}`}
            >
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.projectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectId && (
            <p className="text-red-500 text-sm font-medium">
              {errors.projectId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter apartment description (optional)"
            className="bg-background border-border min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Apartment Images
          </Label>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview || '/placeholder.svg'}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/40 transition-colors relative bg-muted/30">
            <div className="py-2">
              <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">
                Click to upload images
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB each (multiple files allowed)
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
        </div>

        {errors.submit && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {errors.submit}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={createApartment.isPending}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {createApartment.isPending ? 'Creating...' : 'Create Apartment'}
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
    </div>
  )
}
