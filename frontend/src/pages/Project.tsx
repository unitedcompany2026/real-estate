import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Phone,
  Mail,
} from 'lucide-react'

// Layout Card Component
const LayoutCard = ({ layout }: { layout: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="relative h-64 bg-gray-100">
        <img
          src={layout.image}
          alt={layout.name}
          className="w-full h-full object-contain p-4"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {layout.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Size:</span>
            <span className="font-medium text-gray-800">{layout.size} m²</span>
          </div>
          {layout.price && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium text-gray-800">{layout.price}</span>
            </div>
          )}
        </div>

        <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}

export default function Project() {
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock data - replace with actual API call
  const project = {
    id: 1,
    name: 'Archi Kokhta in Bakuriani',
    location: 'Bakuriani',
    date: '9 April St, 11',
    deliveryStatus: '1 house delivered in 2022',
    pricePerSqm: 2052,

    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
    ],

    layouts: [
      {
        id: 1,
        name: 'Studios',
        size: '26.6 - 44',
        price: 'price upon request',
        image:
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      },
      {
        id: 2,
        name: '2-room',
        size: '37.2 - 58.6',
        price: 'price upon request',
        image:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      },
      {
        id: 3,
        name: '3-room',
        size: '27.8 - 64.6',
        price: 'price upon request',
        image:
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      },
    ],
  }

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setCurrentImage(
      prev => (prev - 1 + project.images.length) % project.images.length
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Side - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-96 lg:h-[500px] bg-gray-900">
                <img
                  src={project.images[currentImage]}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImage + 1}/{project.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
            </div>
          </div>

          {/* Right Side - Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {/* Header with Share/Favorite */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {project.name}
                  </h1>
                  <p className="text-gray-600 text-sm">{project.location}</p>
                  <p className="text-gray-500 text-sm mt-1">{project.date}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Delivery Status */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <span className="text-green-500">✓</span>
                <span>{project.deliveryStatus}</span>
              </div>

              {/* Price */}
              <div className="border-t border-b py-4 mb-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price per m²</p>
                    <p className="text-3xl font-bold text-gray-900">
                      from ${project.pricePerSqm.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <span className="text-xl">₾</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <span className="text-xl">$</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Show number
                </button>
                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Fill out the application
                </button>
                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layouts Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Layout Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.layouts.map(layout => (
              <LayoutCard key={layout.id} layout={layout} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
