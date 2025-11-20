import { useState, useEffect, useCallback, useMemo, memo } from 'react'

const NavButton = memo(
  ({
    direction,
    onClick,
    label,
  }: {
    direction: 'prev' | 'next'
    onClick: () => void
    label: string
  }) => (
    <button
      onClick={onClick}
      className={`hidden lg:block cursor-pointer absolute ${
        direction === 'prev' ? 'left-4' : 'right-4'
      } top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30 transition-colors duration-300`}
      aria-label={label}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  )
)

NavButton.displayName = 'NavButton'

const Section = memo(({ section, isLast, isActive, onClick }: any) => (
  <div
    className={`flex-1 relative cursor-pointer transition-all duration-700 overflow-hidden ${
      !isLast ? 'border-r-2 border-white/40' : ''
    }`}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
    <div className="relative z-20 flex flex-col justify-end pb-12 items-center h-full px-6 text-center">
      <div
        className={`transform transition-all duration-700 ${isActive ? 'scale-105' : 'scale-100'}`}
      >
        <h2
          className={`font-light mb-4 transition-all duration-700 ${
            isActive
              ? 'text-4xl lg:text-5xl text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]'
              : 'text-3xl lg:text-4xl text-white'
          }`}
        >
          {section.title}
        </h2>
        <p
          className={`text-sm lg:text-base mb-4 max-w-md leading-relaxed transition-all duration-700 ${
            isActive ? 'text-blue-100' : 'text-white'
          }`}
        >
          {section.description}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {section.features.map((feature: string, idx: number) => (
            <span
              key={idx}
              className={`px-3 py-1.5 backdrop-blur-sm border rounded-full text-xs lg:text-sm transition-all duration-700 ${
                isActive
                  ? 'bg-blue-500/30 border-blue-300/70 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-white/10 border-white/30 text-white'
              }`}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
))

Section.displayName = 'Section'

const DotIndicator = memo(
  ({
    isActive,
    onClick,
    label,
  }: {
    isActive: boolean
    onClick: () => void
    label: string
  }) => (
    <button
      onClick={onClick}
      className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
        isActive ? 'bg-blue-500' : 'bg-white/50'
      }`}
      aria-label={label}
    />
  )
)

DotIndicator.displayName = 'DotIndicator'

const FeaturesSection = () => {
  const backgroundImages = useMemo(
    () => ['/Feature1.png', '/Feature2.png', '/Feature3.png'],
    []
  )

  const sections = useMemo(
    () => [
      {
        id: 'alliance',
        title: 'Alliance Centropolis',
        description:
          "Alliance Group's flagship development in the heart of Batumi, setting new standards for urban luxury and sophisticated living.",
        features: ['City Center', 'Smart Home Tech', 'Premium Location'],
      },
      {
        id: 'emaar',
        title: 'Emaar Eagle Hills ',
        description:
          'A world-class waterfront development by Emaar, combining luxury residential living with stunning marina views.',
        features: ['Marina Views', 'Luxury Residences', 'Resort Amenities'],
      },
      {
        id: 'ambassadori',
        title: 'Ambassadori Island',
        description:
          'An exclusive island development offering unparalleled luxury living with panoramic sea views and world-class facilities.',
        features: ['Island Location', 'Waterfront Living', 'Premium Lifestyle'],
      },
    ],
    []
  )

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  const nextSlide = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length)
  }, [backgroundImages.length])

  const prevSlide = useCallback(() => {
    setCurrentImageIndex(prev =>
      prev === 0 ? backgroundImages.length - 1 : prev - 1
    )
  }, [backgroundImages.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentImageIndex(index)
  }, [])

  const currentMobileSection = useMemo(
    () => sections[currentImageIndex % sections.length],
    [sections, currentImageIndex]
  )

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-1000">
        <img
          src={backgroundImages[currentImageIndex]}
          alt="Apartment Building"
          className="w-full h-full object-cover md:object-cover animate-[panRight_20s_linear_infinite] md:animate-none md:object-center object-left"
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      <style>{`
        @keyframes panRight {
          0% {
            object-position: left center;
          }
          100% {
            object-position: right center;
          }
        }
      `}</style>

      <NavButton
        direction="prev"
        onClick={prevSlide}
        label="Previous Project"
      />
      <NavButton direction="next" onClick={nextSlide} label="Next Project" />

      <div className="relative z-10 hidden md:flex h-full">
        {sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            index={index}
            isLast={index === sections.length - 1}
            isActive={index === currentImageIndex}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
      <div className="relative z-10 md:hidden h-full">
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-transparent pointer-events-none" />
        <div className="relative z-20 flex flex-col justify-end pb-16 items-center h-full px-6 text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            {currentMobileSection.title}
          </h2>
          <p className="text-white text-sm lg:text-base mb-4 max-w-sm leading-relaxed">
            {currentMobileSection.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {currentMobileSection.features.map(
              (feature: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-full text-white text-xs"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30">
        <div className="flex gap-2">
          {backgroundImages.map((_, index) => (
            <DotIndicator
              key={index}
              isActive={index === currentImageIndex}
              onClick={() => goToSlide(index)}
              label={`Project Gallery ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection
