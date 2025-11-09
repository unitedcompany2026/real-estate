import { useState } from 'react'
import { X, Upload, Save, ImageIcon, Languages } from 'lucide-react'
import { useUpdatePartner } from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import type { Partner } from '@/lib/types/partners'
import { TranslationsManager } from './TranslationManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const API_URL = 'http://localhost:3000'

interface EditPartnerProps {
  partner: Partner
  onBack: () => void
  onSuccess: () => void
}

export function EditPartner({ partner, onBack, onSuccess }: EditPartnerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    partner.image ? `${API_URL}/${partner.image}` : null
  )

  console.log(imagePreview)

  const updatePartner = useUpdatePartner()

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
    if (!imageFile) return

    const data = new FormData()
    data.append('image', imageFile)

    try {
      await updatePartner.mutateAsync({ id: partner.id, data })
      onSuccess()
    } catch (error) {
      console.error('Error updating partner:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Edit Partner: {partner.companyName}
        </h3>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </TabsTrigger>
          <TabsTrigger value="translations">
            <Languages className="w-4 h-4 mr-2" />
            Translations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-4">
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
                      setImagePreview(
                        partner.image ? `${API_URL}/${partner.image}` : null
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
              disabled={updatePartner.isPending || !imageFile}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {updatePartner.isPending ? 'Updating...' : 'Update Image'}
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="translations">
          <TranslationsManager partnerId={partner.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
