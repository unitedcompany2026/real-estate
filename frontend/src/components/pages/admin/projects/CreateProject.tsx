'use client'

import type React from 'react'

import { useState } from 'react'
import { X, Upload, Save } from 'lucide-react'
import { useCreateProject } from '@/lib/hooks/useProjects'
import { usePartners } from '@/lib/hooks/usePartners'
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

interface CreateProjectProps {
  onBack: () => void
  onSuccess: () => void
}

export function CreateProject({ onBack, onSuccess }: CreateProjectProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    projectLocation: '',
    partnerId: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createProject = useCreateProject()
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required'
    }
    if (!formData.projectLocation.trim()) {
      newErrors.projectLocation = 'Project location is required'
    }
    if (!formData.partnerId) {
      newErrors.partnerId = 'Partner selection is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const data = new FormData()
    data.append('projectName', formData.projectName)
    data.append('projectLocation', formData.projectLocation)
    data.append('partnerId', formData.partnerId)
    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      await createProject.mutateAsync(data)
      onSuccess()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create project' })
    }
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Create Project
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new project to your portfolio
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
        <div className="space-y-2">
          <Label
            htmlFor="projectName"
            className="text-sm font-medium text-foreground"
          >
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            type="text"
            value={formData.projectName}
            onChange={e =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            placeholder="e.g., Modern Office Building"
            className={`bg-background border ${errors.projectName ? 'border-red-500' : 'border-border'}`}
          />
          {errors.projectName && (
            <p className="text-red-500 text-sm font-medium">
              {errors.projectName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="projectLocation"
            className="text-sm font-medium text-foreground"
          >
            Project Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectLocation"
            type="text"
            value={formData.projectLocation}
            onChange={e =>
              setFormData({ ...formData, projectLocation: e.target.value })
            }
            placeholder="e.g., Downtown District"
            className={`bg-background border ${errors.projectLocation ? 'border-red-500' : 'border-border'}`}
          />
          {errors.projectLocation && (
            <p className="text-red-500 text-sm font-medium">
              {errors.projectLocation}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="partnerId"
            className="text-sm font-medium text-foreground"
          >
            Partner <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.partnerId}
            onValueChange={value =>
              setFormData({ ...formData, partnerId: value })
            }
          >
            <SelectTrigger
              className={`bg-background border ${errors.partnerId ? 'border-red-500' : 'border-border'}`}
            >
              <SelectValue placeholder="Select a partner" />
            </SelectTrigger>
            <SelectContent>
              {partners?.map(partner => (
                <SelectItem key={partner.id} value={partner.id.toString()}>
                  {partner.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.partnerId && (
            <p className="text-red-500 text-sm font-medium">
              {errors.partnerId}
            </p>
          )}
        </div>

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
                    setImagePreview(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="py-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag and drop
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
            disabled={createProject.isPending}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {createProject.isPending ? 'Creating...' : 'Create Project'}
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
