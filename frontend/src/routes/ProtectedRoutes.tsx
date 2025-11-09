import { LoadingScreen } from '@/components/shared/loaders'
import { ROUTES } from '@/constants/routes'
import { useCurrentUser } from '@/lib/hooks/useAuth'
import { getAccessToken } from '@/lib/utils/auth'
import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  redirectTo?: string
  requiredRole?: 'user' | 'admin' | 'moderator'
}

export const ProtectedRoutes = ({
  redirectTo = ROUTES.SIGNIN,
  requiredRole,
}: ProtectedRouteProps) => {
  const token = getAccessToken()
  const { data: user, isLoading, isError } = useCurrentUser()

  if (!token) {
    return <Navigate to={redirectTo} replace />
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user || isError) {
    return <Navigate to={redirectTo} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
