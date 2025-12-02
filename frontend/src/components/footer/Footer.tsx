import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Logo = ({ className }: { className?: string }) => (
  <div
    className={`h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md ${className}`}
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  </div>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <span className={className}>📞</span>
)

const EmailIcon = ({ className }: { className?: string }) => (
  <span className={className}>✉️</span>
)

const CONTACT_PHONE = '+995 555 123 456'
const CONTACT_EMAIL = 'info@unitedcompany.ge'
const TERMS_URL = '#'
const PRIVACY_URL = '#'

export default function Footer() {
  const location = useLocation()
  const pathname = location.pathname
  const [email, setEmail] = useState('')

  const isAdminPath = pathname.includes('/admin')

  if (isAdminPath) {
    return null
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribe:', email)
    setEmail('')
  }

  const isActive = (path: string) => pathname === path

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/our-projects', label: 'Our Projects', comingSoon: true },
    { path: '/projects', label: 'Projects from developers' },
    { path: '/properties', label: 'All property' },
  ]

  const companyLinks = [{ path: '/contact', label: 'Contact' }]

  return (
    <footer className="w-full bg-[#F2F5FF] border-t border-gray-200 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="container mx-auto pt-12 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          <div className="space-y-5 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <Logo />
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                  United Construction
                </span>
                <span className="text-xs font-semibold text-blue-600 leading-tight">
                  Company
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold mb-5 text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <a
                    href={link.comingSoon ? '#' : link.path}
                    onClick={e => link.comingSoon && e.preventDefault()}
                    className={`text-sm transition-all duration-200 inline-flex items-center gap-2 ${
                      link.comingSoon
                        ? 'text-gray-400 cursor-not-allowed'
                        : isActive(link.path)
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-600 hover:text-blue-600 hover:translate-x-1'
                    }`}
                  >
                    {!link.comingSoon && (
                      <span className="text-blue-600">›</span>
                    )}
                    <span className={link.comingSoon ? 'line-through' : ''}>
                      {link.label}
                    </span>
                    {link.comingSoon && (
                      <span className="text-[9px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 px-2 py-0.5 rounded-full shadow-sm">
                        SOON
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-5 text-gray-900">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map(link => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className={`text-sm transition-all duration-200 inline-flex items-center gap-2 ${
                      isActive(link.path)
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-600 hover:text-blue-600 hover:translate-x-1'
                    }`}
                  >
                    <span className="text-blue-600">›</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-5 text-gray-900">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
              >
                <PhoneIcon className="text-lg group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">
                  {CONTACT_PHONE}
                </span>
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
              >
                <EmailIcon className="text-lg group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">
                  {CONTACT_EMAIL}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="container mx-auto py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              © 2024 United Construction Company. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href={TERMS_URL}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Terms & Conditions
              </a>
              <div className="h-4 w-px bg-gray-300"></div>
              <a
                href={PRIVACY_URL}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
