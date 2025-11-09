import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface PartnerCardProps {
  company: {
    id: number
    companyName: string
    image: string
    createdAt: string
  }
}

const PartnerCard = ({ company }: PartnerCardProps) => {
  const [imageError, setImageError] = useState(false)

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    // If it's already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    // If it's a relative path, prepend the API URL
    const apiUrl = 'http://localhost:3000'
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    return `${apiUrl}${cleanPath}`
  }

  const imageUrl = company.image
    ? getImageUrl(company.image)
    : '/placeholder.svg'

  console.log(imageUrl)
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.03)] transition-all duration-300 h-full p-2 hover:shadow-lg">
      <div className="relative h-72 sm:h-72 overflow-hidden rounded-lg group bg-gray-100">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={company.companyName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-2"
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
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-900 transition-colors cursor-pointer">
          {company.companyName}
        </h3>
        <div className="bg-gray-200 rounded-full p-2 hover:bg-blue-900 transition-colors cursor-pointer group/icon">
          <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover/icon:text-white transition-colors" />
        </div>
      </div>
    </div>
  )
}

export default PartnerCard
