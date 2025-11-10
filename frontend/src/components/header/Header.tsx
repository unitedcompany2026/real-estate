import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useCurrentUser, useSignOut } from '@/lib/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { LanguageSwitcher } from '../shared/language-switcher/LanguageSwitcher'

export const Header = () => {
  const { t } = useTranslation()
  const { data: user, isLoading } = useCurrentUser()
  const signOut = useSignOut()

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md">
            <span className="text-lg font-bold text-white">UC</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            United Company
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-8">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to={ROUTES.PARTNERS}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.partners')}
            </Link>
            <Link
              to={ROUTES.ALL_PROJECTS}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.allProjects')}
            </Link>
            <Link
              to={ROUTES.PROPERTY}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.property')}
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Auth & Settings Section */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={signOut.isPending}
                  className="gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-medium">
                    {signOut.isPending
                      ? t('auth.signingOut')
                      : t('auth.logout')}
                  </span>
                </Button>
              </div>
            ) : null}

            {/* {!user && !isLoading && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.SIGNIN)}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t('auth.signIn')}</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(ROUTES.SIGNUP)}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{t('auth.signUp')}</span>
                </Button>
              </div>
            )} */}

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
