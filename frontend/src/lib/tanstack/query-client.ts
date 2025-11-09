import { CACHE_CONFIG } from '@/constants/cache'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.AUTH.STALE_TIME,
      refetchOnWindowFocus: false,
      retry: CACHE_CONFIG.AUTH.RETRY_COUNT,
      gcTime: CACHE_CONFIG.AUTH.GC_TIME,
    },
  },
})
