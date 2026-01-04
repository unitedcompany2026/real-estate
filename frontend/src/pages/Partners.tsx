import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import PartnerCard from '@/components/pages/partners/PartnerCard'
import { usePartners } from '@/lib/hooks/usePartners'
import { Pagination } from '@/components/shared/pagination/Pagination'
import { useDocumentMeta } from '@/lib/hooks/useDocumentMeta'
import { LoadingOverlay } from '@/components/shared/loaders/LoadingOverlay'
import IsError from '@/components/shared/loaders/IsError'

export default function Partners() {
  const { t, i18n } = useTranslation()
  const [searchParams, _] = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1', 10)

  const { data, isLoading, error } = usePartners({
    lang: i18n.language,
    page,
    limit: 9,
  })

  const partners = data?.data || []
  const meta = data?.meta

  useDocumentMeta({
    title: t('meta.partners.title'),
    description: t('meta.partners.description'),
    keywords: t('meta.partners.keywords'),
    ogImage: '/Logo.png',
    lang: i18n.language,
  })

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />
  }

  if (error) {
    return <IsError />
  }

  return (
    <div className="min-h-screen py-12 px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {partners.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
              {partners.map(partner => (
                <Link
                  key={partner.id}
                  to={`/projects?page=1&partnerId=${partner.id}`}
                >
                  <PartnerCard partner={partner} />
                </Link>
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                hasNextPage={meta.hasNextPage}
                hasPreviousPage={meta.hasPreviousPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('partners.noPartners')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
