import type React from 'react'
import { useState } from 'react'
import { X, Upload, Save } from 'lucide-react'
import { useCreateSlide } from '@/lib/hooks/useSlides'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'

interface CreateSlideProps {
  onBack: () => void
  onSuccess: () => void
}

export function CreateSlide({ onBack, onSuccess }: CreateSlideProps) {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    order: 0,
    isActive: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createSlide = useCreateSlide()

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
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!imageFile) {
      newErrors.image = 'Image is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const data = new FormData()
    data.append('title', formData.title)
    data.append('link', formData.link)
    data.append('order', formData.order.toString())
    data.append('isActive', formData.isActive.toString())
    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      await createSlide.mutateAsync(data)
      onSuccess()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create slide' })
    }
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Create Slide
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new slide to the homepage slideshow
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
            htmlFor="title"
            className="text-sm font-medium text-foreground"
          >
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Find Your Dream Property"
            className={`bg-background border ${errors.title ? 'border-red-500' : 'border-border'}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm font-medium">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="link" className="text-sm font-medium text-foreground">
            Link (Optional)
          </Label>
          <Input
            id="link"
            type="text"
            value={formData.link}
            onChange={e => setFormData({ ...formData, link: e.target.value })}
            placeholder="e.g., /properties or https://example.com"
            className="bg-background border border-border"
          />
          <p className="text-xs text-muted-foreground">
            URL where users will be redirected when clicking the slide
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="order"
              className="text-sm font-medium text-foreground"
            >
              Order
            </Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={e =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              className="bg-background border border-border"
            />
            <p className="text-xs text-muted-foreground">
              Display order (lower numbers appear first)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Status
            </Label>
            <div className="flex items-center space-x-2 h-10">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={checked =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm text-foreground cursor-pointer"
              >
                Active (visible on homepage)
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Slide Image <span className="text-red-500">*</span>
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/40 transition-colors relative bg-muted/30">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 rounded-md border border-border"
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
                  PNG, JPG up to 5MB (recommended: 1920x1080)
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
          {errors.image && (
            <p className="text-red-500 text-sm font-medium">{errors.image}</p>
          )}
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
            disabled={createSlide.isPending}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {createSlide.isPending ? 'Creating...' : 'Create Slide'}
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
