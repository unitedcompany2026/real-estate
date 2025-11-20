import { useState } from 'react'
import { Button } from '@/components/ui/button'

const Logo = ({ className }: { className?: string }) => (
  <div
    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg ${className}`}
  >
    <span className="text-xl font-bold text-white">UC</span>
  </div>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <span className={className}>📞</span>
)

const EmailIcon = ({ className }: { className?: string }) => (
  <span className={className}>✉️</span>
)

const SocialIcons = () => (
  <div className="flex gap-3">
    <a
      href="#"
      className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-110"
    >
      <span className="text-lg">🐦</span>
    </a>
    <a
      href="#"
      className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-110"
    >
      <span className="text-lg">📘</span>
    </a>
    <a
      href="#"
      className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-110"
    >
      <span className="text-lg">📸</span>
    </a>
  </div>
)

const CONTACT_PHONE = '+995 555 123 456'
const CONTACT_EMAIL = 'info@unitedcompany.ge'
const TERMS_URL = '#'
const PRIVACY_URL = '#'

export default function Footer() {
  const pathname = window.location.pathname
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
    { path: '/all-projects', label: 'All Projects' },
    { path: '/properties', label: 'Properties' },
  ]

  const companyLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/careers', label: 'Careers' },
    { path: '/blog', label: 'Blog' },
  ]

  return (
    <footer className="w-full bg-[#F2F5FF] border-t border-gray-200 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <Logo />
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                United Company
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your trusted partner in real estate. We help you find the perfect
              property that matches your dreams and aspirations.
            </p>
            <SocialIcons />
          </div>
          <div>
            <h3 className="text-base font-bold mb-6 text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-3">
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
                      <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        SOON
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold mb-6 text-gray-900">Company</h3>
            <ul className="space-y-3">
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
            <h3 className="text-base font-bold mb-6 text-gray-900">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
              >
                <PhoneIcon className="text-xl group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">
                  {CONTACT_PHONE}
                </span>
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
              >
                <EmailIcon className="text-xl group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">
                  {CONTACT_EMAIL}
                </span>
              </a>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">
                  Subscribe to our newsletter
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-gray-400"
                  />
                  <Button
                    onClick={handleSubscribe}
                    className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 United Company. All rights reserved.
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
