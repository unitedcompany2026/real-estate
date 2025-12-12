import type React from 'react'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import type { Apartment } from '@/lib/types/apartments'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export const ProjectApartmentCard = ({
  apartment,
}: {
  apartment: Apartment
}) => {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const hasImages = apartment.images.length > 0
  const hasMultipleImages = apartment.images.length > 1

  const slides = apartment.images.map(img => ({
    src: `${import.meta.env.VITE_API_IMAGE_URL}/${img}`,
    alt: t('apartmentCard.roomApartment', { count: apartment.room }),
  }))

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(
      prev => (prev - 1 + apartment.images.length) % apartment.images.length
    )
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(prev => (prev + 1) % apartment.images.length)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
        <div className="relative h-64 bg-gray-100">
          {hasImages ? (
            <div className="relative h-full bg-gray-900">
              {apartment.images.map((img, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_API_IMAGE_URL}/${img}`}
                  alt={`${t('apartmentCard.roomApartment', { count: apartment.room })} - Image ${index + 1}`}
                  onClick={() => openLightbox(current)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 cursor-zoom-in shadow-lg ${
                    index === current ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              {hasMultipleImages && (
                <>
                  <Button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10 h-7 w-7 sm:h-8 sm:w-8"
                    aria-label={t('apartmentCard.previousImage')}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-800" />
                  </Button>

                  <Button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10 h-7 w-7 sm:h-8 sm:w-8"
                    aria-label={t('apartmentCard.nextImage')}
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-800" />
                  </Button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {apartment.images.map((_, index) => (
                      <Button
                        key={index}
                        onClick={e => {
                          e.stopPropagation()
                          setCurrent(index)
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          index === current
                            ? 'bg-white w-6'
                            : 'bg-white/50 w-1.5 hover:bg-white/75'
                        }`}
                        aria-label={t('apartmentCard.goToImage', {
                          number: index + 1,
                        })}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400">{t('apartmentCard.noImages')}</p>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col h-32 border-t-2 border-gray-100">
          <div className="mb-2 pb-2 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {t('apartmentCard.roomApartment', { count: apartment.room })}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {t('apartmentCard.area')}:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {apartment.area} m²
              </span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs text-gray-600 line-clamp-3">
              {apartment.description || t('apartmentCard.noDescription')}
            </p>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </>
  )
}
