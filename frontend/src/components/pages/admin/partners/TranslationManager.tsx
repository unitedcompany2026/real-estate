'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import {
  usePartnerTranslations,
  useUpsertTranslation,
  useDeleteTranslation,
} from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { UpsertTranslationDto } from '@/lib/services/partners.service'

interface TranslationsManagerProps {
  partnerId: number
}

interface Translation {
  id: number
  language: string
  companyName: string
  partnerId: number
}

const languageOptions = [
  { value: 'ka', label: 'Georgian (ქართული)' },
  { value: 'ru', label: 'Russian (Русский)' },
  { value: 'en', label: 'English' },
]

export function TranslationsManager({ partnerId }: TranslationsManagerProps) {
  const [editingTranslation, setEditingTranslation] =
    useState<UpsertTranslationDto | null>(null)
  const [newTranslation, setNewTranslation] = useState<UpsertTranslationDto>({
    language: 'ka',
    companyName: '',
  })
  const [isAdding, setIsAdding] = useState(false)

  const { data: translations = [], isLoading } =
    usePartnerTranslations(partnerId)
  const upsertTranslation = useUpsertTranslation()
  const deleteTranslation = useDeleteTranslation()

  const handleSaveTranslation = async (isEdit = false) => {
    const data = isEdit ? editingTranslation : newTranslation
    if (!data?.companyName.trim()) return

    try {
      await upsertTranslation.mutateAsync({ id: partnerId, data })
      if (isEdit) {
        setEditingTranslation(null)
      } else {
        setNewTranslation({ language: 'ka', companyName: '' })
        setIsAdding(false)
      }
    } catch (error) {
      console.error('Error saving translation:', error)
    }
  }

  const handleDeleteTranslation = async (language: string) => {
    if (!window.confirm(`Delete ${language} translation?`)) return

    try {
      await deleteTranslation.mutateAsync({ id: partnerId, language })
    } catch (error) {
      console.error('Error deleting translation:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading translations...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-foreground">
            Company Name Translations
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Manage translations in different languages
          </p>
        </div>
        <Button
          variant={isAdding ? 'destructive' : 'default'}
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="gap-2"
        >
          {isAdding ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Translation
            </>
          )}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-border bg-muted/40">
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Language</Label>
                <Select
                  value={newTranslation.language}
                  onValueChange={value =>
                    setNewTranslation({ ...newTranslation, language: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border">
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
              <div className="space-y-2">
                <Label className="text-sm font-medium">Translated Name</Label>
                <Input
                  type="text"
                  value={newTranslation.companyName}
                  onChange={e =>
                    setNewTranslation({
                      ...newTranslation,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="Enter company name in this language"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <Button
              onClick={() => handleSaveTranslation(false)}
              disabled={upsertTranslation.isPending}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Translation
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {translations.length === 0 ? (
          <Card className="border-dashed border-border bg-muted/20">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-sm text-muted-foreground">
                No translations yet. Add one to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          translations.map((translation: Translation) => (
            <Card key={translation.language} className="border-border">
              <CardContent className="pt-6">
                {editingTranslation?.language === translation.language ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Language</Label>
                        <Input
                          type="text"
                          value={editingTranslation.language}
                          disabled
                          className="bg-muted border-border text-muted-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Translated Name
                        </Label>
                        <Input
                          type="text"
                          value={editingTranslation.companyName}
                          onChange={e =>
                            setEditingTranslation({
                              ...editingTranslation,
                              companyName: e.target.value,
                            })
                          }
                          placeholder="Enter company name"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingTranslation(null)}
                        className="px-4"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSaveTranslation(true)}
                        disabled={upsertTranslation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {
                          languageOptions.find(
                            l => l.value === translation.language
                          )?.label
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {translation.companyName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTranslation(translation)}
                        className="text-foreground/60 hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteTranslation(translation.language)
                        }
                        className="text-red-500/60 hover:text-red-500 hover:bg-red-50"
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
