import { Link, useLocation } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LanguageSwitcher } from '../shared/language-switcher/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

const useCurrentUser = () => ({ data: null, isLoading: false })
const useSignOut = () => ({ mutateAsync: async () => {}, isPending: false })
const Button = ({ children, onClick, disabled, className }: any) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
)

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const ROUTES = {
  HOME: '/',
  ALL_PROJECTS: '/projects',
  PROPERTY: '/properties',
  CONTACT: '/contact',
  PARTNERS: '/partners',
}

export default function Header() {
  const { t, i18n } = useTranslation()
  const { data: user, isLoading } = useCurrentUser()
  const signOut = useSignOut()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const pathname = location.pathname
  const isAdminPath = pathname.includes('/admin')

  if (isAdminPath) return null

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  /** ✅ helper to append lang */
  const withLang = (path: string) => `${path}?lang=${i18n.language}`

  const isActive = (path: string) => pathname === path

  const navItems = [
    {
      path: ROUTES.HOME,
      label: t('nav.home', { defaultValue: 'Home' }),
      isComingSoon: false,
    },
    {
      path: '/our-projects',
      label: t('nav.ourProjects', { defaultValue: 'Our Projects' }),
      isComingSoon: true,
    },
    {
      path: ROUTES.ALL_PROJECTS,
      label: t('nav.partnerProjects', {
        defaultValue: 'Projects from developers',
      }),
      isComingSoon: false,
    },
    {
      path: ROUTES.PROPERTY,
      label: t('nav.properties', { defaultValue: 'All property' }),
      isComingSoon: false,
    },
    {
      path: ROUTES.CONTACT,
      label: t('nav.contact', { defaultValue: 'Contact' }),
      isComingSoon: false,
    },
  ]

  return (
    <header className="px-8 md:px-12 lg:px-16 xl:px-28 top-0 z-50 w-full bg-[#F2F5FF]/60 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex h-20 items-center justify-between">
        {/* LOGO */}
        <Link
          to={withLang(ROUTES.HOME)}
          className="flex items-center gap-5 shrink-0 group"
        >
          <img src="/Logo.png" className="w-20 h-20" alt="Logo" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-tight">
              United
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Construction and Real Estate
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.isComingSoon ? '#' : withLang(item.path)}
                onClick={e => item.isComingSoon && e.preventDefault()}
                className={cn(
                  'relative px-4 py-2 text-[15px] font-medium transition-all duration-300 group/nav',
                  item.isComingSoon
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-blue-600'
                )}
              >
                <span className={cn(item.isComingSoon && 'line-through')}>
                  {item.label}
                </span>

                {isActive(item.path) && !item.isComingSoon && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-[calc(100%-2rem)] bg-gradient-to-r from-blue-600 to-blue-700 rounded-full" />
                )}

                {!item.isComingSoon && !isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-400 rounded-full transition-all duration-300 group-hover/nav:w-[calc(100%-2rem)]" />
                )}

                {item.isComingSoon && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 px-2 py-0.5 rounded-full shadow-sm">
                    SOON
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-300">
            {isLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">Admin</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {t('auth.admin', { defaultValue: 'Admin' })}
                  </span>
                </div>

                <Button
                  onClick={handleSignOut}
                  disabled={signOut.isPending}
                  className="gap-2 text-gray-800 hover:text-red-600 hover:bg-red-50 h-10 px-4 rounded-lg transition-all font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  {signOut.isPending ? t('auth.signingOut') : t('auth.logout')}
                </Button>
              </div>
            ) : null}

            <LanguageSwitcher />
          </div>
        </div>

        {/* MOBILE */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden p-2 text-gray-700 hover:bg-blue-50 rounded-lg">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] bg-white/95">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className="mt-8 flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.isComingSoon ? '#' : withLang(item.path)}
                  onClick={e => {
                    if (item.isComingSoon) e.preventDefault()
                    else setMobileMenuOpen(false)
                  }}
                  className={cn(
                    'px-4 py-3 rounded-lg font-medium',
                    item.isComingSoon
                      ? 'text-gray-400'
                      : isActive(item.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 px-4">
              <LanguageSwitcher />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
