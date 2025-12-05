import { useState } from 'react'
import { Edit, Save } from 'lucide-react'
import {
  useSlideTranslations,
  useUpsertSlideTranslation,
} from '@/lib/hooks/useSlides'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { LANGUAGE_OPTIONS } from '@/constants/languages'

interface SlideTranslationsManagerProps {
  slideId: number
}

interface SlideTranslation {
  id: number
  language: string
  title: string
  slideId: number
}

interface UpsertTranslationDto {
  language: string
  title: string
}

export function SlideTranslationsManager({
  slideId,
}: SlideTranslationsManagerProps) {
  const [editingTranslation, setEditingTranslation] =
    useState<UpsertTranslationDto | null>(null)

  const { data: translations = [], isLoading } = useSlideTranslations(slideId)
  const upsertTranslation = useUpsertSlideTranslation()

  const handleSaveTranslation = async () => {
    if (!editingTranslation?.title.trim()) return

    try {
      await upsertTranslation.mutateAsync({
        id: slideId,
        data: editingTranslation,
      })
      setEditingTranslation(null)
    } catch (error) {
      console.error('Error saving translation:', error)
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
          Slide Title Translations
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Manage translations for this slide
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
          translations.map((translation: SlideTranslation) => (
            <Card key={translation.language} className="border-border">
              <CardContent className="pt-6">
                {editingTranslation?.language === translation.language ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Language</Label>
                      <Input
                        type="text"
                        value={
                          LANGUAGE_OPTIONS.find(
                            l => l.value === editingTranslation.language
                          )?.label || editingTranslation.language
                        }
                        disabled
                        className="bg-muted border-border text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Translated Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={editingTranslation.title}
                        onChange={e =>
                          setEditingTranslation({
                            ...editingTranslation,
                            title: e.target.value,
                          })
                        }
                        className="bg-background border-border"
                        placeholder="Enter translated title"
                      />
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
                        disabled={
                          upsertTranslation.isPending ||
                          !editingTranslation.title.trim()
                        }
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium">
                        {
                          LANGUAGE_OPTIONS.find(
                            l => l.value === translation.language
                          )?.label
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {translation.title || (
                          <span className="italic text-muted-foreground/60">
                            No translation
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTranslation(translation)}
                        className="text-foreground/60 hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
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
