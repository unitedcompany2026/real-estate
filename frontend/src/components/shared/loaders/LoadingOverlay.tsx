import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils/cn'

interface LoadingOverlayProps {
  isLoading: boolean
  blur?: boolean
}

export const LoadingOverlay = ({
  isLoading,
  blur = true,
}: LoadingOverlayProps) => {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-4',
        'bg-background/80',
        blur && 'backdrop-blur-sm'
      )}
    >
      <Spinner />
    </div>
  )
}
