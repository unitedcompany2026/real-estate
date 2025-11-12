import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApartments, useDeleteApartment } from '@/lib/hooks/useApartments'
import { useProjects } from '@/lib/hooks/useProjects'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Apartment } from '@/lib/types/apartments'
import { CreateApartment } from './CreateApartment'
import { EditApartment } from './EditApartment'
import { AdminApartmentCard } from './AdminApartmentCard'

export default function ApartmentsPanel() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  )
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined)

  const {
    data: apartments,
    isLoading,
    error,
  } = useApartments(undefined, selectedProjectId) // default language only
  const { data: projects } = useProjects() // default language only
  const deleteApartment = useDeleteApartment()

  const handleEdit = (apartment: Apartment) => {
    setSelectedApartment(apartment)
    setView('edit')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this apartment?'))
      return

    try {
      await deleteApartment.mutateAsync(id)
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete apartment'
      )
    }
  }

  const handleBack = () => {
    setView('list')
    setSelectedApartment(null)
  }

  if (view === 'create') {
    return <CreateApartment onBack={handleBack} onSuccess={handleBack} />
  }

  if (view === 'edit' && selectedApartment) {
    return (
      <EditApartment
        apartment={selectedApartment}
        onBack={handleBack}
        onSuccess={handleBack}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-foreground">Apartments</h2>
          <p className="text-muted-foreground mt-2">Manage your apartments</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select
            value={selectedProjectId?.toString() || 'all'}
            onValueChange={value =>
              setSelectedProjectId(value === 'all' ? undefined : Number(value))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects?.map(project => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.projectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setView('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Apartment
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Error loading apartments. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments && apartments.length > 0 ? (
            apartments.map(apartment => (
              <AdminApartmentCard
                key={apartment.id}
                apartment={apartment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No apartments found. Add your first apartment!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
