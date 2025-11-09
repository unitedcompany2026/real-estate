import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import CreatePartnerModal from '@/components/pages/admin/partners/CreatePartnerModal'
import AdminPartnerCard from '@/components/pages/admin/partners/AdminPartnerCard'

const API_URL = 'http://localhost:3000'

interface Partner {
  id: number
  companyName: string
  image: string | null
  createdAt: string
}

export default function PartnersPanel() {
  const { data: partners, isLoading, error } = usePartners()
  const createPartner = useCreatePartner()
  const updatePartner = useUpdatePartner()
  const deletePartner = useDeletePartner()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)

  const handleSavePartner = async (data: FormData): Promise<void> => {
    try {
      if (editingPartner) {
        // ✅ Update mode - add id to FormData
        data.append('id', editingPartner.id.toString())
        await updatePartner.mutateAsync(data)
      } else {
        // ✅ Create mode - no id needed
        await createPartner.mutateAsync(data)
      }
      setIsModalOpen(false)
      setEditingPartner(null)
    } catch (err) {
      console.error('Error saving partner:', err)
    }
  }

  const handleEdit = (partner: Partner): void => {
    setEditingPartner(partner)
    setIsModalOpen(true)
  }

  const handleDelete = async (partnerId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner.mutateAsync(partnerId)
      } catch (err) {
        console.error('Error deleting partner:', err)
      }
    }
  }

  const handleAddNew = (): void => {
    setEditingPartner(null)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Construction Partners
        </h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Partner
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Error loading partners. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners && partners.length > 0 ? (
            partners.map((partner: Partner) => (
              <AdminPartnerCard
                key={partner.id}
                partner={partner}
                onEdit={handleEdit}
                onDelete={handleDelete}
                apiUrl={API_URL}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No partners found. Add your first partner!
            </div>
          )}
        </div>
      )}

      <CreatePartnerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSavePartner}
        isSubmitting={createPartner.isPending || updatePartner.isPending}
        editingPartner={editingPartner}
      />
    </>
  )
}
