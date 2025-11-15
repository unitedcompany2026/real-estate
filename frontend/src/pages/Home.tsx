// pages/HomePage.tsx
import { useTranslation } from 'react-i18next'
import { usePartners } from '@/lib/hooks/usePartners'
import { useProjects } from '@/lib/hooks/useProjects'
import { useApartments } from '@/lib/hooks/useApartments'
import PartnersCarousel from '@/components/pages/home/PartnerCarousel'
import ProjectsCarousel from '@/components/pages/home/ProjectsCarousel'
import ApartmentsCarousel from '@/components/pages/home/ApartmentsCarousel'
import PropertyCarousel from '@/components/pages/home/PropertyCarousel'
import SuggestSection from '@/components/pages/home/SuggestionsSection'
import FeaturesSection from '@/components/pages/home/FeaturesSection'
import Cover from '@/components/pages/home/Cover'

const HomePage = () => {
  const { i18n } = useTranslation()
  const { data: partners, isLoading: partnersLoading } = usePartners(
    i18n.language
  )
  const { data: projectsResponse, isLoading: projectsLoading } = useProjects({
    lang: i18n.language,
  })
  const { data: apartments, isLoading: apartmentsLoading } = useApartments(
    i18n.language
  )

  return (
    <main className="min-h-screen">
      <section className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <Cover />
      </section>
      <PropertyCarousel />

      {projectsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        projectsResponse && (
          <section className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <ProjectsCarousel projectsResponse={projectsResponse} />
          </section>
        )
      )}

      <FeaturesSection />
      {apartmentsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        apartments && (
          <section className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <ApartmentsCarousel apartments={apartments} />
          </section>
        )
      )}

      <SuggestSection />

      {partnersLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        partners && (
          <section className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <PartnersCarousel companies={partners} />
          </section>
        )
      )}
    </main>
  )
}

export default HomePage
