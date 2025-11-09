import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils/cn'

interface LoadingScreenProps {
  fullScreen?: boolean
  message?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const LoadingScreen = ({
  fullScreen = true,
  message,
  className,
}: LoadingScreenProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      <Spinner />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  )
}
