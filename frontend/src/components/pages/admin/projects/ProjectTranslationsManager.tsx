import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import {
  useProjectTranslations,
  useUpsertProjectTranslation,
  useDeleteProjectTranslation,
} from '@/lib/hooks/useProjects'
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
import type { UpsertProjectTranslationDto } from '@/lib/types/projects'

interface ProjectTranslationsManagerProps {
  projectId: number
}

interface ProjectTranslation {
  id: number
  language: string
  projectName: string
  projectLocation: string
  projectId: number
}

const languageOptions = [
  { value: 'ka', label: 'Georgian (ka)' },
  { value: 'ru', label: 'Russian (ru)' },
  { value: 'en', label: 'English (en)' },
]

export function ProjectTranslationsManager({
  projectId,
}: ProjectTranslationsManagerProps) {
  const [editingTranslation, setEditingTranslation] =
    useState<UpsertProjectTranslationDto | null>(null)
  const [newTranslation, setNewTranslation] =
    useState<UpsertProjectTranslationDto>({
      language: 'ka',
      projectName: '',
      projectLocation: '',
    })
  const [isAdding, setIsAdding] = useState(false)

  const { data: translations = [], isLoading } =
    useProjectTranslations(projectId)
  const upsertTranslation = useUpsertProjectTranslation()
  const deleteTranslation = useDeleteProjectTranslation()

  const handleSaveTranslation = async (isEdit = false) => {
    const data = isEdit ? editingTranslation : newTranslation
    if (!data?.projectName.trim() || !data?.projectLocation.trim()) return

    try {
      await upsertTranslation.mutateAsync({ id: projectId, data })
      if (isEdit) {
        setEditingTranslation(null)
      } else {
        setNewTranslation({
          language: 'ka',
          projectName: '',
          projectLocation: '',
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
      await deleteTranslation.mutateAsync({ id: projectId, language })
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Project Name</Label>
                <Input
                  type="text"
                  value={newTranslation.projectName}
                  onChange={e =>
                    setNewTranslation({
                      ...newTranslation,
                      projectName: e.target.value,
                    })
                  }
                  placeholder="Enter translated project name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-base font-medium">
                  Project Location
                </Label>
                <Input
                  type="text"
                  value={newTranslation.projectLocation}
                  onChange={e =>
                    setNewTranslation({
                      ...newTranslation,
                      projectLocation: e.target.value,
                    })
                  }
                  placeholder="Enter translated project location"
                  className="mt-2"
                />
              </div>
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
          translations.map((translation: ProjectTranslation) => (
            <Card key={translation.language} className="overflow-hidden">
              <CardContent className="p-6">
                {editingTranslation?.language === translation.language ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Language</Label>
                        <Input
                          type="text"
                          value={editingTranslation.language}
                          disabled
                          className="bg-muted text-muted-foreground mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Project Name
                        </Label>
                        <Input
                          type="text"
                          value={editingTranslation.projectName}
                          onChange={e =>
                            setEditingTranslation({
                              ...editingTranslation,
                              projectName: e.target.value,
                            })
                          }
                          placeholder="Enter translated project name"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Project Location
                        </Label>
                        <Input
                          type="text"
                          value={editingTranslation.projectLocation}
                          onChange={e =>
                            setEditingTranslation({
                              ...editingTranslation,
                              projectLocation: e.target.value,
                            })
                          }
                          placeholder="Enter translated project location"
                          className="mt-2"
                        />
                      </div>
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
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="font-semibold text-blue-600">
                        {translation.language.toUpperCase()}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-muted-foreground">Name:</span>{' '}
                          <span className="text-foreground font-medium">
                            {translation.projectName}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Location:
                          </span>{' '}
                          <span className="text-foreground font-medium">
                            {translation.projectLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
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
