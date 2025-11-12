import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const ProjectCard = ({ project }: any) => {
  const [imageError, setImageError] = useState(false)

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/placeholder.svg'
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    const apiUrl = 'http://localhost:3000'
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    return `${apiUrl}${cleanPath}`
  }

  const projectImage = getImageUrl(project.image)

  const projectName =
    project?.translation?.projectName ||
    project?.projectName ||
    'Unnamed Project'

  const partnerName =
    project?.partner?.translation?.companyName ||
    project?.partner?.companyName ||
    ''

  return (
    <div className="bg-white rounded-xl border border-gray-300 transition-all duration-300 h-full p-2 cursor-pointer">
      <div className="relative h-72 overflow-hidden rounded-lg">
        {!imageError ? (
          <img
            src={projectImage}
            alt={projectName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-2 sm:p-3 flex justify-between items-center">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-900 transition-colors">
            {projectName}
          </h3>
          {partnerName && (
            <p className="text-xs text-gray-500 mt-1">{partnerName}</p>
          )}
        </div>
        <div className="bg-gray-200 rounded-full p-2 hover:bg-blue-900 transition-colors">
          <ArrowUpRight className="w-4 h-4 text-gray-700 hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
