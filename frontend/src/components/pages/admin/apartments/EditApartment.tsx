'use client'

import type React from 'react'

import { useState } from 'react'
import { X, Upload, Save, ImagePlus, Trash2 } from 'lucide-react'
import {
  useUpdateApartment,
  useDeleteApartmentImage,
} from '@/lib/hooks/useApartments'
import { useProjects } from '@/lib/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Apartment } from '@/lib/types/apartments'
import { ApartmentTranslationsManager } from './ApartmentTranslationsManager'
import { Textarea } from '@/components/ui/textarea'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface EditApartmentProps {
  apartment: Apartment
  onBack: () => void
  onSuccess: () => void
}

export function EditApartment({
  apartment,
  onBack,
  onSuccess,
}: EditApartmentProps) {
  const [room, setRoom] = useState(apartment.room.toString())
  const [area, setArea] = useState(apartment.area.toString())
  const [floor, setFloor] = useState(apartment.floor.toString())
  const [totalFloors, setTotalFloors] = useState(
    apartment.totalFloors.toString()
  )
  const [description, setDescription] = useState(apartment.description || '')
  const [projectId, setProjectId] = useState(
    apartment.project?.id.toString() || ''
  )
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<
    'details' | 'images' | 'translations'
  >('details')

  const updateApartment = useUpdateApartment()
  const deleteImage = useDeleteApartmentImage()
  const { data: projectsResponse } = useProjects()
  const projects = projectsResponse?.data || []
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newFiles = [...newImageFiles, ...files]
    setNewImageFiles(newFiles)

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteExistingImage = async (imageIndex: number) => {
    if (!window.confirm('Delete this image?')) return

    try {
      await deleteImage.mutateAsync({ id: apartment.id, imageIndex })
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleSubmit = async () => {
    const data = new FormData()

    if (room !== apartment.room.toString()) {
      data.append('room', room)
    }
    if (area !== apartment.area.toString()) {
      data.append('area', area)
    }
    if (floor !== apartment.floor.toString()) {
      data.append('floor', floor)
    }
    if (totalFloors !== apartment.totalFloors.toString()) {
      data.append('totalFloors', totalFloors)
    }
    if (description !== (apartment.description || '')) {
      data.append('description', description)
    }
    if (projectId && projectId !== apartment.project?.id.toString()) {
      data.append('projectId', projectId)
    }

    newImageFiles.forEach(file => {
      data.append('images', file)
    })

    const hasChanges =
      room !== apartment.room.toString() ||
      area !== apartment.area.toString() ||
      floor !== apartment.floor.toString() ||
      totalFloors !== apartment.totalFloors.toString() ||
      description !== (apartment.description || '') ||
      (projectId && projectId !== apartment.project?.id.toString()) ||
      newImageFiles.length > 0

    if (hasChanges) {
      try {
        await updateApartment.mutateAsync({ id: apartment.id, data })
        onSuccess()
      } catch (error) {
        console.error('Error updating apartment:', error)
      }
    }
  }

  const hasChanges =
    room !== apartment.room.toString() ||
    area !== apartment.area.toString() ||
    floor !== apartment.floor.toString() ||
    totalFloors !== apartment.totalFloors.toString() ||
    description !== (apartment.description || '') ||
    (projectId && projectId !== apartment.project?.id.toString()) ||
    newImageFiles.length > 0

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Edit Apartment
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {apartment.room} Room{apartment.room > 1 ? 's' : ''} -{' '}
            {apartment.area}m²
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

      <div className="flex gap-2 mb-8 border-b border-border pb-0">
        <button
          onClick={() => setActiveSection('details')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'details'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveSection('images')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'images'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Images
        </button>
        <button
          onClick={() => setActiveSection('translations')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'translations'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          🌐 Translations
        </button>
      </div>

      <div className="space-y-6">
        {activeSection === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="room"
                  className="text-sm font-medium text-foreground"
                >
                  Number of Rooms
                </Label>
                <Input
                  id="room"
                  type="number"
                  min="1"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="area"
                  className="text-sm font-medium text-foreground"
                >
                  Area (m²)
                </Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  step="0.01"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="floor"
                  className="text-sm font-medium text-foreground"
                >
                  Floor
                </Label>
                <Input
                  id="floor"
                  type="number"
                  min="1"
                  value={floor}
                  onChange={e => setFloor(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="totalFloors"
                  className="text-sm font-medium text-foreground"
                >
                  Total Floors
                </Label>
                <Input
                  id="totalFloors"
                  type="number"
                  min="1"
                  value={totalFloors}
                  onChange={e => setTotalFloors(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="projectId"
                className="text-sm font-medium text-foreground"
              >
                Project
              </Label>
              <Select value={projectId} onValueChange={setProjectId}>
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

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter apartment description"
                className="bg-background border-border min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={updateApartment.isPending || !hasChanges}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateApartment.isPending ? 'Updating...' : 'Update Details'}
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
            {apartment.images && apartment.images.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Existing Images
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {apartment.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`${API_URL}/${image}` || '/placeholder.svg'}
                        alt={`Apartment ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteExistingImage(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newImagePreviews.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  New Images to Upload
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview || '/placeholder.svg'}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Add More Images
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/40 transition-colors relative bg-muted/30">
                <div className="py-2">
                  <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Click to upload new images
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

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={
                  updateApartment.isPending || newImageFiles.length === 0
                }
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateApartment.isPending
                  ? 'Uploading...'
                  : 'Upload New Images'}
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
