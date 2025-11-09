import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/shared/errors'
import { QueryProvider } from './providers/QueryProvider'
import { Header } from './components/header/Header'
import { AppRoutes } from './routes/AppRoutes'
import { queryClient } from './lib/tanstack/query-client'

export const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo)
      }}
      onReset={() => {
        queryClient.clear()
        window.location.href = '/'
      }}
    >
      <BrowserRouter>
        <QueryProvider>
          <Header />
          <AppRoutes />
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
