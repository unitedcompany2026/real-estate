'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import {
  useApartmentTranslations,
  useUpsertApartmentTranslation,
  useDeleteApartmentTranslation,
} from '@/lib/hooks/useApartments'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { UpsertApartmentTranslationDto } from '@/lib/services/apartments.service'
import { Textarea } from '@/components/ui/textarea'

interface ApartmentTranslationsManagerProps {
  apartmentId: number
}

interface ApartmentTranslation {
  id: number
  language: string
  description: string
  apartmentId: number
}

const languageOptions = [
  { value: 'ka', label: 'Georgian (ka)' },
  { value: 'ru', label: 'Russian (ru)' },
  { value: 'en', label: 'English (en)' },
]

export function ApartmentTranslationsManager({
  apartmentId,
}: ApartmentTranslationsManagerProps) {
  const [editingTranslation, setEditingTranslation] =
    useState<UpsertApartmentTranslationDto | null>(null)
  const [newTranslation, setNewTranslation] =
    useState<UpsertApartmentTranslationDto>({
      language: 'ka',
      description: '',
    })
  const [isAdding, setIsAdding] = useState(false)

  const { data: translations = [], isLoading } =
    useApartmentTranslations(apartmentId)
  const upsertTranslation = useUpsertApartmentTranslation()
  const deleteTranslation = useDeleteApartmentTranslation()

  const handleSaveTranslation = async (isEdit = false) => {
    const data = isEdit ? editingTranslation : newTranslation
    if (!data?.description.trim()) return

    try {
      await upsertTranslation.mutateAsync({ id: apartmentId, data })
      if (isEdit) {
        setEditingTranslation(null)
      } else {
        setNewTranslation({
          language: 'ka',
          description: '',
        })
        setIsAdding(false)
      }
    } catch (error) {
      console.error('Error saving translation:', error)
    }
  }

  const handleDeleteTranslation = async (language: string) => {
    if (!window.confirm(`Delete ${language} translation?`)) return

    try {
      await deleteTranslation.mutateAsync({ id: apartmentId, language })
    } catch (error) {
      console.error('Error deleting translation:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading translations...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg text-foreground">
          Existing Translations
        </h4>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className={
            isAdding
              ? 'bg-gray-500 hover:bg-gray-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        >
          {isAdding ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Translation
            </>
          )}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Language</Label>
                <Select
                  value={newTranslation.language}
                  onValueChange={value =>
                    setNewTranslation({ ...newTranslation, language: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Description</Label>
              <Textarea
                value={newTranslation.description}
                onChange={e =>
                  setNewTranslation({
                    ...newTranslation,
                    description: e.target.value,
                  })
                }
                placeholder="Enter translated description"
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleSaveTranslation(false)}
                disabled={upsertTranslation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Translation
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {translations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
            No translations yet
          </div>
        ) : (
          translations.map((translation: ApartmentTranslation) => (
            <Card key={translation.language} className="overflow-hidden">
              <CardContent className="p-6">
                {editingTranslation?.language === translation.language ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Language</Label>
                        <input
                          type="text"
                          value={editingTranslation.language}
                          disabled
                          className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-md border border-border mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <Textarea
                        value={editingTranslation.description}
                        onChange={e =>
                          setEditingTranslation({
                            ...editingTranslation,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter translated description"
                        className="mt-2 min-h-[120px]"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleSaveTranslation(true)}
                        disabled={upsertTranslation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingTranslation(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="font-semibold text-blue-600">
                        {translation.language.toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Description:
                        </span>
                        <p className="text-foreground mt-1 whitespace-pre-wrap">
                          {translation.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTranslation(translation)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteTranslation(translation.language)
                        }
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
