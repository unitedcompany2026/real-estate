import { useState } from 'react'
import { X, Upload, Save } from 'lucide-react'
import { useCreatePartner } from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CreatePartnerProps {
  onBack: () => void
  onSuccess: () => void
}

export function CreatePartner({ onBack, onSuccess }: CreatePartnerProps) {
  const [formData, setFormData] = useState({ companyName: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createPartner = useCreatePartner()

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
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const data = new FormData()
    data.append('companyName', formData.companyName)
    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      await createPartner.mutateAsync(data)
      onSuccess()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create partner' })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Create New Partner</h3>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={e =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            placeholder="Enter company name"
            className={errors.companyName ? 'border-red-500' : ''}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <Label>Company Logo</Label>
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
            disabled={createPartner.isPending}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {createPartner.isPending ? 'Creating...' : 'Create Partner'}
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
