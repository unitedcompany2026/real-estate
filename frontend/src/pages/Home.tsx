import { useTranslation } from 'react-i18next'
import { usePartners } from '@/lib/hooks/usePartners'
import { useProjects } from '@/lib/hooks/useProjects'
import PartnersCarousel from '@/components/pages/home/PartnerCarousel'
import ProjectsCarousel from '@/components/pages/home/ProjectsCarousel'
import QuestionSection from '@/components/pages/home/QuestionSection'
import PropertyCarousel from '@/components/pages/home/PropertyCarousel'

const HomePage = () => {
  const { i18n } = useTranslation()
  const { data: partners, isLoading: partnersLoading } = usePartners(
    i18n.language
  )
  const { data: projects, isLoading: projectsLoading } = useProjects(
    i18n.language
  )

  return (
    <main className="min-h-screen bg-gray-50">
      {/* <Cover /> */}
      <PropertyCarousel />
      {/* Partners Carousel */}
      {partnersLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        partners && (
          <section className=" px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
            <PartnersCarousel companies={partners} />{' '}
          </section>
        )
      )}

      {/* Projects Carousel */}
      {projectsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        projects && (
          <section className=" px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
            <ProjectsCarousel projects={projects} />
          </section>
        )
      )}
      <QuestionSection />
    </main>
  )
}

export default HomePage
