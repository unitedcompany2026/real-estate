import { useState, useEffect } from 'react'
import {
  Building2,
  Building,
  Home,
  Store,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useHomepageSlides } from '@/lib/hooks/useHomepageSlides'
import { getImageUrl } from '@/lib/utils/image-utils'

export default function Cover() {
  const { data: slides = [], isLoading, isError } = useHomepageSlides('en')

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide, slides.length])

  const handleNext = () => {
    if (isTransitioning || slides.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide(prev => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handlePrev = () => {
    if (isTransitioning || slides.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-80px)] relative px-6 sm:px-8 md:px-12 lg:px-16 xl:px-28">
        <div className="absolute w-full h-[70vh] md:h-full md:inset-0 bg-gray-200 animate-pulse">
          <div className="absolute w-full inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
        </div>
        <div className="relative z-10 container w-full h-[70vh] md:h-full flex flex-col justify-center items-center text-center px-4">
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-24 md:h-32 flex items-center justify-center">
              <div className="w-96 h-16 bg-white/20 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || slides.length === 0) {
    return (
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-80px)] relative px-6 sm:px-8 md:px-12 lg:px-16 xl:px-28">
        <div className="absolute w-full h-[70vh] md:h-full md:inset-0 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="absolute w-full inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
        </div>
        <div className="relative z-10 container w-full h-[70vh] md:h-full flex flex-col justify-center items-center text-center px-4">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
              Find Your Dream Property
            </h1>
          </div>
        </div>
        <PropertyTypeCards />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[calc(100vh-80px)] relative px-6 sm:px-8 md:px-12 lg:px-16 xl:px-28">
      {/* Background Slides */}
      <div className="absolute w-full h-[70vh] md:h-full md:inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full bg-cover bg-center transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${getImageUrl(slide.image)})`,
            }}
          >
            <div className="absolute w-full inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
          </div>
        ))}
      </div>

      {/* Arrows Left / Right */}
      {slides.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={isTransitioning}
            className="absolute left-6 top-1/2 -translate-y-1/2 
                       w-12 h-12 rounded-full bg-black/30 backdrop-blur-md 
                       hover:bg-black/40 transition-all duration-300 
                       flex items-center justify-center group 
                       disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="absolute right-6 top-1/2 -translate-y-1/2 
                       w-12 h-12 rounded-full bg-black/30 backdrop-blur-md 
                       hover:bg-black/40 transition-all duration-300 
                       flex items-center justify-center group 
                       disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* OPTIONAL: Bottom dots — enable if needed */}
      {/*
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 rounded-full 
              ${index === currentSlide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
      */}

      {/* Title & Content */}
      <div className="relative z-10 pt-20 container w-full h-[70vh] md:h-full flex flex-col justify-center items-center text-center px-4">
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <div className="relative w-full max-w-5xl flex items-center justify-center min-h-[120px] md:min-h-[160px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                  index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white   px-6 py-4 rounded-2xl bg-black/30 backdrop-blur-sm">
                  {slide.title}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PropertyTypeCards />
    </div>
  )
}

function PropertyTypeCards() {
  return (
    <div className="w-full pb-6 md:pb-12 px-2 md:px-0">
      <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 auto-rows-fr">
        <a
          href="/projects"
          className="group relative w-full h-full bg-blue-50/90 backdrop-blur-md hover:bg-blue-100/95 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 md:p-4 border border-blue-200/60 hover:border-blue-300"
        >
          <div className="flex flex-col h-full w-full items-center justify-center text-center gap-1.5 md:gap-2.5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
              Projects from developers
            </h3>
          </div>
        </a>

        <a
          href="/properties"
          className="group relative h-full bg-emerald-50/90 backdrop-blur-md hover:bg-emerald-100/95 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 md:p-4 border border-emerald-200/60 hover:border-emerald-300"
        >
          <div className="flex flex-col h-full items-center justify-center text-center gap-1.5 md:gap-2.5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Building className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
              Apartments for sale
            </h3>
          </div>
        </a>

        <a
          href="/properties"
          className="group relative h-full bg-amber-50/90 backdrop-blur-md hover:bg-amber-100/95 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 md:p-4 border border-amber-200/60 hover:border-amber-300"
        >
          <div className="flex flex-col h-full items-center justify-center text-center gap-1.5 md:gap-2.5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Home className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
              Apartments for rent
            </h3>
          </div>
        </a>

        <a
          href="/properties"
          className="group relative h-full bg-purple-50/90 backdrop-blur-md hover:bg-purple-100/95 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 md:p-4 border border-purple-200/60 hover:border-purple-300"
        >
          <div className="flex flex-col h-full items-center justify-center text-center gap-1.5 md:gap-2.5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Store className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
              Commercial
            </h3>
          </div>
        </a>

        <a
          href="/properties"
          className="group relative h-full bg-teal-50/90 backdrop-blur-md hover:bg-teal-100/95 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 md:p-4 border border-teal-200/60 hover:border-teal-300"
        >
          <div className="flex flex-col h-full items-center justify-center text-center gap-1.5 md:gap-2.5">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
              Land for Sale
            </h3>
          </div>
        </a>
      </div>
    </div>
  )
}
