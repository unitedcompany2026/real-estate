import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, Filter } from 'lucide-react'
import ProjectCard from '@/components/pages/projects/ProjectCard'
import { useProjects } from '@/lib/hooks/useProjects'

export default function AllProjects() {
  const { t, i18n } = useTranslation()
  const {
    data: allProjects = [],
    isLoading,
    error,
  } = useProjects(i18n.language)

  const [selectedPartner, setSelectedPartner] = useState<string>('All')
  const [selectedCity, setSelectedCity] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [showFilters, setShowFilters] = useState(false)

  // Get translated partner names for filters
  const getTranslatedPartnerName = (partner: any) => {
    if (!partner) return null

    if (partner.translations && partner.translations.length > 0) {
      const translation = partner.translations.find(
        (t: any) => t.language === i18n.language
      )
      if (translation?.companyName) {
        return translation.companyName
      }
    }
    return partner.companyName
  }

  const partners = [
    'All',
    ...Array.from(
      new Set(
        allProjects
          .map(p => getTranslatedPartnerName(p.partner))
          .filter(Boolean)
      )
    ),
  ]

  const cities = [
    'All',
    ...Array.from(
      new Set(
        allProjects
          .map(p => {
            if (!p.projectLocation) return ''
            const match = p.projectLocation.match(/,\s*(.+)$/)
            return match ? match[1] : p.projectLocation
          })
          .filter(Boolean)
      )
    ),
  ]

  // Note: If you add status field to your Project model, uncomment this
  // const statuses = [
  //   'All',
  //   ...Array.from(new Set(allProjects.map(p => p.status).filter(Boolean))),
  // ]

  // Filter projects
  const filteredProjects = allProjects.filter(project => {
    const translatedPartnerName = getTranslatedPartnerName(project.partner)
    const matchesPartner =
      selectedPartner === 'All' || translatedPartnerName === selectedPartner
    const matchesCity =
      selectedCity === 'All' || project.projectLocation?.includes(selectedCity)
    // const matchesStatus =
    //   selectedStatus === 'All' || project.status === selectedStatus
    return matchesPartner && matchesCity
  })

  const resetFilters = () => {
    setSelectedPartner('All')
    setSelectedCity('All')
    setSelectedStatus('All')
  }

  const hasActiveFilters =
    selectedPartner !== 'All' ||
    selectedCity !== 'All' ||
    selectedStatus !== 'All'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('projects.allProjects')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('projects.explorePortfolio')}
            </p>
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('projects.allProjects')}
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{t('projects.errorLoading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('projects.allProjects')}
          </h1>
          <p className="text-gray-600 mb-6">{t('projects.explorePortfolio')}</p>

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              {t('projects.showing')}{' '}
              <span className="font-semibold text-gray-900">
                {filteredProjects.length}
              </span>{' '}
              {t('projects.of')}{' '}
              <span className="font-semibold text-gray-900">
                {allProjects.length}
              </span>{' '}
              {t('projects.projectsCount')}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">{t('projects.filters')}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Partner Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('projects.partner')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {partners.map(partner => (
                      <button
                        key={partner ?? 'All'}
                        onClick={() => setSelectedPartner(partner ?? 'All')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedPartner === (partner ?? 'All')
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {(partner ?? 'All') === 'All'
                          ? t('projects.all')
                          : (partner ?? '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('projects.city')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cities.map(city => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedCity === city
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {city === 'All' ? t('projects.all') : city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter - Uncomment when you add status field */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('projects.status')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedStatus === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'All' ? t('projects.all') : status}
                      </button>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('projects.resetFilters')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                currentLanguage={i18n.language}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {t('projects.noProjectsFound')}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {t('projects.adjustFilters')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('projects.clearFilters')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
