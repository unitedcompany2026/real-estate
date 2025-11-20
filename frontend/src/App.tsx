import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryProvider } from './providers/QueryProvider'
import { AppRoutes } from './routes/AppRoutes'
import { queryClient } from './lib/tanstack/query-client'
import Footer from './components/footer/Footer'
import { ScrollToTop } from './lib/utils/scroll-top'
import { ErrorFallback } from './components/shared/errors/ErrorFallback'
import Header from './components/header/Header'

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
          <ScrollToTop />
          <AppRoutes />
          <Footer />
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
