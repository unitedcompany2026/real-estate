import { Phone, MessageCircle, Loader2 } from 'lucide-react'
import { useApartments } from '@/lib/hooks/useApartments'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useProject } from '@/lib/hooks/useProjects'
import { ProjectImageCarousel } from '@/components/pages/projects/ProjectImageCarousel'
import { ProjectApartmentCard } from '@/components/pages/projects/ProjectApartmentCard'
import { useTranslation } from 'react-i18next'

const getQuarter = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  const month = date.getMonth()
  const quarter = Math.floor(month / 3) + 1
  const year = date.getFullYear()
  return `Q${quarter} ${year}`
}

export default function ProjectPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const projectId = Number(id)

  const {
    data: project,
    isLoading: projectLoading,
    error,
  } = useProject(projectId)

  const { data: apartmentsResponse, isLoading: apartmentsLoading } =
    useApartments({
      projectId,
    })

  const apartments = apartmentsResponse?.data || []

  const isLoading = projectLoading || apartmentsLoading

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-900 animate-spin" />
          <p className="text-gray-600">{t('projectPage.loadingProject')}</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t('projectPage.projectNotFound')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('projectPage.projectNotFoundDescription')}
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/projects')}
          >
            {t('projectPage.backToProjects')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 pb-12 md:pb-16 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mb-8 lg:mb-12">
          <div className="lg:col-span-2">
            <div className="h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px]">
              <ProjectImageCarousel
                gallery={project.gallery || []}
                image={project.image || ''}
                projectName={project.projectName || ''}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-5 lg:p-6 lg:sticky lg:top-20">
              <div className="mb-4 sm:mb-5 pb-4 border-b-2 border-gray-300">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {project.projectName || t('projectPage.noName')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {project.projectLocation || t('projectPage.noLocation')}
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-gray-200">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {t('projectPage.startingPrice')}
                  </span>
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    {project.priceFrom
                      ? `${project.priceFrom.toLocaleString()}`
                      : t('projectPage.notAvailable')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-gray-200">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {t('projectPage.delivery')}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-blue-900">
                    {project.deliveryDate
                      ? getQuarter(project.deliveryDate)
                      : t('projectPage.notAvailable')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-gray-200">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {t('projectPage.floors')}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">
                    {project.numFloors || t('projectPage.notAvailable')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-2.5">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {t('projectPage.totalUnits')}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">
                    {project.numApartments || t('projectPage.notAvailable')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-2.5 pt-3 sm:pt-4">
                <Button
                  size="lg"
                  className="w-full bg-blue-900 hover:bg-blue-800 h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  +995 595 80 47 95
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 h-10 sm:h-11 lg:h-12 text-sm sm:text-base bg-transparent"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  {t('projectPage.contactWhatsApp')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-12">
          {apartments.length > 0 ? (
            <>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                {t('projectPage.availableApartments')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {apartments.map(apartment => (
                  <ProjectApartmentCard
                    key={apartment.id}
                    apartment={apartment}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                {t('projectPage.noApartments')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
