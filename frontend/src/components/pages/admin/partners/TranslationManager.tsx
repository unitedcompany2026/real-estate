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
  { value: 'ka', label: 'Georgian (ka)' },
  { value: 'ru', label: 'Russian (ru)' },
  { value: 'en', label: 'English (en)' },
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
    return <div className="text-center py-4">Loading translations...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-700">Existing Translations</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
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
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label>Language</Label>
              <Select
                value={newTranslation.language}
                onValueChange={value =>
                  setNewTranslation({ ...newTranslation, language: value })
                }
              >
                <SelectTrigger>
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
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                value={newTranslation.companyName}
                onChange={e =>
                  setNewTranslation({
                    ...newTranslation,
                    companyName: e.target.value,
                  })
                }
                placeholder="Enter translated company name"
              />
            </div>
            <Button
              onClick={() => handleSaveTranslation(false)}
              disabled={upsertTranslation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Translation
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {translations.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No translations yet
          </p>
        ) : (
          translations.map((translation: Translation) => (
            <Card key={translation.language}>
              <CardContent className="pt-6">
                {editingTranslation?.language === translation.language ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Language</Label>
                      <Input
                        type="text"
                        value={editingTranslation.language}
                        disabled
                        className="bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        type="text"
                        value={editingTranslation.companyName}
                        onChange={e =>
                          setEditingTranslation({
                            ...editingTranslation,
                            companyName: e.target.value,
                          })
                        }
                        placeholder="Enter translated company name"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveTranslation(true)}
                        disabled={upsertTranslation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingTranslation(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-700">
                        {translation.language.toUpperCase()}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">
                        {translation.companyName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTranslation(translation)}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteTranslation(translation.language)
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
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
