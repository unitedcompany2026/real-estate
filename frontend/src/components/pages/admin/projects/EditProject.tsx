'use client'

import type React from 'react'

import { useState } from 'react'
import { X, Upload, Save } from 'lucide-react'
import { useUpdateProject } from '@/lib/hooks/useProjects'
import { usePartners } from '@/lib/hooks/usePartners'
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

import type { Project } from '@/lib/types/projects'
import { ProjectTranslationsManager } from './ProjectTranslationsManager'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface EditProjectProps {
  project: Project
  onBack: () => void
  onSuccess: () => void
}

export function EditProject({ project, onBack, onSuccess }: EditProjectProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    project.image ? `${API_URL}/${project.image}` : null
  )
  const [partnerId, setPartnerId] = useState(
    project.partnerId ? project.partnerId.toString() : ''
  )
  const [projectLocation, setProjectLocation] = useState(
    project.projectLocation || ''
  )
  const [activeSection, setActiveSection] = useState<
    'details' | 'image' | 'translations'
  >('details')

  const updateProject = useUpdateProject()
  const { data: partners } = usePartners('en')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    const data = new FormData()

    if (imageFile) {
      data.append('image', imageFile)
    }
    if (partnerId && partnerId !== project.partnerId?.toString()) {
      data.append('partnerId', partnerId)
    }
    if (projectLocation !== project.projectLocation) {
      data.append('projectLocation', projectLocation)
    }

    if (
      imageFile ||
      (partnerId && partnerId !== project.partnerId?.toString()) ||
      projectLocation !== project.projectLocation
    ) {
      try {
        await updateProject.mutateAsync({ id: project.id, data })
        onSuccess()
      } catch (error) {
        console.error('Error updating project:', error)
      }
    }
  }

  const hasChanges =
    imageFile ||
    (partnerId && partnerId !== project.partnerId?.toString()) ||
    projectLocation !== project.projectLocation

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Edit Project
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {project.projectName}
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
          onClick={() => setActiveSection('image')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'image'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Image
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
            <div className="space-y-2">
              <Label
                htmlFor="projectLocation"
                className="text-sm font-medium text-foreground"
              >
                Project Location
              </Label>
              <Input
                id="projectLocation"
                type="text"
                value={projectLocation}
                onChange={e => setProjectLocation(e.target.value)}
                placeholder="e.g., Downtown District"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="partnerId"
                className="text-sm font-medium text-foreground"
              >
                Partner
              </Label>
              <Select value={partnerId} onValueChange={setPartnerId}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners?.map(partner => (
                    <SelectItem key={partner.id} value={partner.id.toString()}>
                      {partner.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={updateProject.isPending || !hasChanges}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProject.isPending ? 'Updating...' : 'Update Details'}
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

        {activeSection === 'image' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Project Image
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/40 transition-colors relative bg-muted/30">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || '/placeholder.svg'}
                      alt="Preview"
                      className="max-h-48 rounded-md border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-8 w-8"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(
                          project.image ? `${API_URL}/${project.image}` : null
                        )
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground">
                      Click to upload new image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={updateProject.isPending || !imageFile}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProject.isPending ? 'Updating...' : 'Update Image'}
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
          <ProjectTranslationsManager projectId={project.id} />
        )}
      </div>
    </div>
  )
}
