import { useState, useEffect } from 'react'
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Create New Project</h3>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="projectName">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            type="text"
            value={formData.projectName}
            onChange={e =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            placeholder="Enter project name"
            className={errors.projectName ? 'border-red-500' : ''}
          />
          {errors.projectName && (
            <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="projectLocation">
            Project Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectLocation"
            type="text"
            value={formData.projectLocation}
            onChange={e =>
              setFormData({ ...formData, projectLocation: e.target.value })
            }
            placeholder="Enter project location"
            className={errors.projectLocation ? 'border-red-500' : ''}
          />
          {errors.projectLocation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.projectLocation}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="partnerId">
            Partner <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.partnerId}
            onValueChange={value =>
              setFormData({ ...formData, partnerId: value })
            }
          >
            <SelectTrigger className={errors.partnerId ? 'border-red-500' : ''}>
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
          {errors.partnerId && (
            <p className="text-red-500 text-sm mt-1">{errors.partnerId}</p>
          )}
        </div>

        <div>
          <Label>Project Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors relative">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
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
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={createProject.isPending}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {createProject.isPending ? 'Creating...' : 'Create Project'}
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
