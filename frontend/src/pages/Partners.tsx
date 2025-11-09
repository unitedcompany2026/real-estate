import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PartnerCard from '@/components/pages/partners/PartnerCard'
import { usePartners } from '@/lib/hooks/usePartners'

export default function Partners() {
  const { t, i18n } = useTranslation()
  const { data: companies, isLoading, error } = usePartners(i18n.language)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl text-center sm:text-4xl font-bold text-gray-800 mb-2">
              {t('partners.title')}
            </h1>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl text-center sm:text-4xl font-bold text-gray-800 mb-2">
              {t('partners.title')}
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{t('partners.errorLoading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-center sm:text-4xl font-bold text-gray-800 mb-2">
            {t('partners.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies && companies.length > 0 ? (
            companies.map(company => (
              <Link key={company.id} to={`/partners/${company.id}`}>
                <PartnerCard company={company} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {t('partners.noPartners')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
