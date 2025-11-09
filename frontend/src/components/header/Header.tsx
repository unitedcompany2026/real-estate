import { Link, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCurrentUser, useSignOut } from '@/lib/hooks/useAuth'
import { ROUTES } from '@/constants/routes'

export const Header = () => {
  const { data: user, isLoading } = useCurrentUser()
  const signOut = useSignOut()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">MIGx</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to={ROUTES.PARTNERS}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Partners
          </Link>
          <Link
            to={ROUTES.ALL_PROJECTS}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            All Projects
          </Link>
          <Link
            to={ROUTES.PROPERTY}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Property
          </Link>
          <Link
            to={ROUTES.CONTACT}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-32 animate-pulse rounded-md bg-gray-200" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={signOut.isPending}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {signOut.isPending ? 'Signing out...' : 'Logout'}
                </span>
              </Button>
            </div>
          ) : null}

          {!user && !isLoading && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.SIGNIN)}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(ROUTES.SIGNUP)}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
