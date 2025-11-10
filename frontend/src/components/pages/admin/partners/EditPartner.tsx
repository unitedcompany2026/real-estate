'use client'

import type React from 'react'

import { useState } from 'react'
import { X, Upload, Save } from 'lucide-react'
import { useUpdatePartner } from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Partner } from '@/lib/types/partners'
import { TranslationsManager } from './TranslationManager'

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
  const [activeSection, setActiveSection] = useState<'image' | 'translations'>(
    'image'
  )

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
    <div className="bg-background rounded-lg border border-border shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Edit Partner
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {partner.companyName}
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
          onClick={() => setActiveSection('image')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'image'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Logo
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
        {activeSection === 'image' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-foreground">
                Company Logo
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/40 transition-colors relative bg-muted/30 mt-2">
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
                          partner.image ? `${API_URL}/${partner.image}` : null
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
                      Click to upload new logo
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
                disabled={updatePartner.isPending || !imageFile}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {updatePartner.isPending ? 'Updating...' : 'Update Logo'}
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
          <TranslationsManager partnerId={partner.id} />
        )}
      </div>
    </div>
  )
}
