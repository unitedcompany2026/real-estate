import { useState } from 'react'
import { Edit, Trash2, Save } from 'lucide-react'
import {
  usePartnerTranslations,
  useUpsertTranslation,
  useDeleteTranslation,
} from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import type { UpsertTranslationDto } from '@/lib/services/partners.service'
import { LANGUAGE_OPTIONS } from '@/constants/languages'

interface TranslationsManagerProps {
  partnerId: number
}

interface Translation {
  id: number
  language: string
  companyName: string
  partnerId: number
}

export function TranslationsManager({ partnerId }: TranslationsManagerProps) {
  const [editingTranslation, setEditingTranslation] =
    useState<UpsertTranslationDto | null>(null)

  const { data: translations = [], isLoading } =
    usePartnerTranslations(partnerId)
  const upsertTranslation = useUpsertTranslation()
  const deleteTranslation = useDeleteTranslation()

  const handleSaveTranslation = async () => {
    if (!editingTranslation?.companyName.trim()) return

    try {
      await upsertTranslation.mutateAsync({
        id: partnerId,
        data: editingTranslation,
      })
      setEditingTranslation(null)
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
      <div>
        <h3 className="font-semibold text-foreground">
          Company Name Translations
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Manage translations for this partner
        </p>
      </div>

      <div className="space-y-3">
        {translations.length === 0 ? (
          <Card className="border-dashed border-border bg-muted/20">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-sm text-muted-foreground">
                No translations available.
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
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingTranslation(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveTranslation}
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
                      <p className="font-medium">
                        {
                          LANGUAGE_OPTIONS.find(
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
