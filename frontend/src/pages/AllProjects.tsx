import { useState } from 'react'
import { Building2, Filter } from 'lucide-react'
import ProjectCard from '@/components/pages/projects/ProjectCard'

interface Project {
  id: number
  name: string
  location: string
  status: string
  year: string
  type: string
  partner: string
  images: string[]
}

// Mock data - combining all partner projects
const allProjects: Project[] = [
  {
    id: 1,
    name: 'Orbi Millennium',
    location: 'Batumi Boulevard',
    status: 'Completed',
    year: '2023',
    type: 'Residential',
    partner: 'Orbi Group',
    images: [
      'https://storage.googleapis.com/bd-ge-01/buildings-v2/2560x1920/34367.jpg',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    ],
  },
  {
    id: 2,
    name: 'Orbi Continental',
    location: 'New Boulevard, Batumi',
    status: 'Under Construction',
    year: '2025',
    type: 'Mixed-Use',
    partner: 'Orbi Group',
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop',
    ],
  },
  {
    id: 3,
    name: 'Orbi Plaza',
    location: 'City Center, Batumi',
    status: 'Completed',
    year: '2022',
    type: 'Commercial',
    partner: 'Orbi Group',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    ],
  },
  {
    id: 4,
    name: 'Orbi Beach Tower',
    location: 'Seaside Avenue, Batumi',
    status: 'Planning',
    year: '2026',
    type: 'Residential',
    partner: 'Orbi Group',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    ],
  },
  {
    id: 5,
    name: 'Alliance Residence',
    location: 'Downtown Batumi',
    status: 'Completed',
    year: '2023',
    type: 'Residential',
    partner: 'Alliance',
    images: [
      'https://alliance.ge/static/media/YaZGZf4YZ5tfkFXU9ki2z2R2s50QgJExbTdSGhCn.png',
    ],
  },
  {
    id: 6,
    name: 'Alliance Business Center',
    location: 'Business District, Batumi',
    status: 'Under Construction',
    year: '2025',
    type: 'Commercial',
    partner: 'Alliance',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    ],
  },
  {
    id: 7,
    name: 'Metropol Tower',
    location: 'Central Batumi',
    status: 'Completed',
    year: '2024',
    type: 'Residential',
    partner: 'Metropol',
    images: [
      'https://pmpymcjrhduyyrsk.public.blob.vercel-storage.com/Oval%20building-UPvH0loBnFxwOvZEw4FDNpQjZpYCtT.png',
    ],
  },
  {
    id: 8,
    name: 'Metropol Gardens',
    location: 'Green Zone, Batumi',
    status: 'Planning',
    year: '2026',
    type: 'Residential',
    partner: 'Metropol',
    images: [
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop',
    ],
  },
]

export default function AllProjects() {
  const [selectedPartner, setSelectedPartner] = useState<string>('All')
  const [selectedCity, setSelectedCity] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filters
  const partners = [
    'All',
    ...Array.from(new Set(allProjects.map(p => p.partner))),
  ]
  const cities = [
    'All',
    ...Array.from(
      new Set(
        allProjects.map(p => {
          const match = p.location.match(/,\s*(.+)$/)
          return match ? match[1] : p.location
        })
      )
    ),
  ]
  const statuses = [
    'All',
    ...Array.from(new Set(allProjects.map(p => p.status))),
  ]

  // Filter projects
  const filteredProjects = allProjects.filter(project => {
    const matchesPartner =
      selectedPartner === 'All' || project.partner === selectedPartner
    const matchesCity =
      selectedCity === 'All' || project.location.includes(selectedCity)
    const matchesStatus =
      selectedStatus === 'All' || project.status === selectedStatus
    return matchesPartner && matchesCity && matchesStatus
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8   py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Projects
          </h1>
          <p className="text-gray-600 mb-6">
            Explore our complete portfolio of construction projects
          </p>

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredProjects.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-900">
                {allProjects.length}
              </span>{' '}
              projects
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Partner Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {partners.map(partner => (
                      <button
                        key={partner}
                        onClick={() => setSelectedPartner(partner)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedPartner === partner
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {partner}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
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
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
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
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset all filters
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No projects found</p>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your filters to see more results
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
