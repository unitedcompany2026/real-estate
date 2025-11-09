import { useState } from 'react'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Calendar,
} from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: number
    name: string
    images: string[]
    location?: string
    status?: string
    year?: string
    type?: string
    companyName?: string // Optional: show company name for multi-partner views
  }
  variant?: 'partner' | 'project' // Switch between partner card style and project card style
  onViewDetails?: () => void
}

const ProjectCard = ({
  project,
  variant = 'project',
  onViewDetails,
}: ProjectCardProps) => {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage(prev => (prev + 1) % project.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage(
      prev => (prev - 1 + project.images.length) % project.images.length
    )
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Under Construction':
        return 'bg-blue-100 text-blue-800'
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Partner variant (minimal style)
  if (variant === 'partner') {
    return (
      <div
        className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.03)] transition-all duration-300 h-full p-2 cursor-pointer hover:shadow-xl"
        onClick={onViewDetails}
      >
        <div className="relative h-72 overflow-hidden rounded-lg group">
          <img
            src={project.images[currentImage] || '/placeholder.svg'}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Image Navigation */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImage + 1}/{project.images.length}
              </div>
            </>
          )}

          {/* Status badge for partner variant if provided */}
          {project.status && (
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
          )}
        </div>

        <div className="p-2 sm:p-3 flex justify-between items-center">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-900 transition-colors">
              {project.name}
            </h3>
            {project.companyName && (
              <p className="text-xs text-gray-500 mt-1">
                {project.companyName}
              </p>
            )}
          </div>
          <div className="bg-gray-200 rounded-full p-2 hover:bg-blue-900 transition-colors group/icon">
            <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover/icon:text-white transition-colors" />
          </div>
        </div>
      </div>
    )
  }

  // Project variant (detailed style)
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-64 overflow-hidden group">
        <img
          src={project.images[currentImage] || '/placeholder.svg'}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {project.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {currentImage + 1}/{project.images.length}
            </div>
          </>
        )}

        {project.status && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}
            >
              {project.status}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{project.name}</h3>

        {project.companyName && (
          <div className="mb-3 text-sm text-gray-500 font-medium">
            by {project.companyName}
          </div>
        )}

        <div className="space-y-2">
          {project.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-blue-900" />
              <span>{project.location}</span>
            </div>
          )}

          {project.type && (
            <div className="flex items-center text-gray-600 text-sm">
              <Building2 className="w-4 h-4 mr-2 text-blue-900" />
              <span>{project.type}</span>
            </div>
          )}

          {project.year && (
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-2 text-blue-900" />
              <span>{project.year}</span>
            </div>
          )}
        </div>

        <button
          onClick={onViewDetails}
          className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default ProjectCard
