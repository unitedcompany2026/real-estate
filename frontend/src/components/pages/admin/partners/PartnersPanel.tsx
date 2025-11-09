import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePartners, useDeletePartner } from '@/lib/hooks/usePartners'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Partner } from '@/lib/types/partners'
import { CreatePartner } from './CreatePartner'
import { EditPartner } from './EditPartner'
import { AdminPartnerCard } from './AdminPartnerCard'

export default function PartnersPanel() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [currentLang, setCurrentLang] = useState('en')

  const { data: partners, isLoading, error } = usePartners(currentLang)
  const deletePartner = useDeletePartner()

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner)
    setView('edit')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return

    try {
      await deletePartner.mutateAsync(id)
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete partner'
      )
    }
  }

  const handleBack = () => {
    setView('list')
    setSelectedPartner(null)
  }

  if (view === 'create') {
    return <CreatePartner onBack={handleBack} onSuccess={handleBack} />
  }

  if (view === 'edit' && selectedPartner) {
    return (
      <EditPartner
        partner={selectedPartner}
        onBack={handleBack}
        onSuccess={handleBack}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Construction Partners
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your construction partners and translations
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={currentLang} onValueChange={setCurrentLang}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ka">Georgian</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setView('create')}>
            <Plus className="w-5 h-5 mr-2" />
            Add Partner
          </Button>
        </div>
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
            partners.map(partner => (
              <AdminPartnerCard
                key={partner.id}
                partner={partner}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No partners found. Add your first partner!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
