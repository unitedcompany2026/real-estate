import { useState } from 'react'
import { X, Upload, Save, ImageIcon, Languages, Building } from 'lucide-react'
import { useUpdateProject } from '@/lib/hooks/useProjects'
import { usePartners } from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

    // Only submit if there are changes
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Edit Project: {project.projectName}
        </h3>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">
            <Building className="w-4 h-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="image">
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </TabsTrigger>
          <TabsTrigger value="translations">
            <Languages className="w-4 h-4 mr-2" />
            Translations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor="projectLocation">Project Location</Label>
            <Input
              id="projectLocation"
              type="text"
              value={projectLocation}
              onChange={e => setProjectLocation(e.target.value)}
              placeholder="Enter project location"
            />
          </div>

          <div>
            <Label htmlFor="partnerId">Partner</Label>
            <Select value={partnerId} onValueChange={setPartnerId}>
              <SelectTrigger>
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

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={updateProject.isPending || !hasChanges}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateProject.isPending ? 'Updating...' : 'Update Details'}
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
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
                      setImagePreview(
                        project.image ? `${API_URL}/${project.image}` : null
                      )
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload new image
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

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={updateProject.isPending || !imageFile}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateProject.isPending ? 'Updating...' : 'Update Image'}
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="translations">
          <ProjectTranslationsManager projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
