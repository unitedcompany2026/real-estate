import { useState, useEffect, useRef } from 'react'
import { ImageIcon } from 'lucide-react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: string // e.g., "16/9", "4/3"
  priority?: boolean // Load immediately without lazy loading
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = '16/9',
  priority = false,
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
  }

  // Generate optimized image URL with size parameters
  const getOptimizedSrc = (originalSrc: string, _?: number) => {
    // If your backend supports image resizing, add query parameters
    // Example: return `${originalSrc}?w=${width}&q=75`
    // For now, just return the original src
    return originalSrc
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Blur placeholder while loading */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Image not available</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && !error && (
        <img
          ref={imgRef}
          src={getOptimizedSrc(src)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          // Responsive images using srcset
          srcSet={`
            ${getOptimizedSrc(src, 400)} 400w,
            ${getOptimizedSrc(src, 800)} 800w,
            ${getOptimizedSrc(src, 1200)} 1200w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
    </div>
  )
}
