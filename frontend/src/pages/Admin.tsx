import { useState, useEffect } from 'react'
import { Users, Building, Home } from 'lucide-react'
import PartnersPanel from '@/components/pages/admin/partners/PartnersPanel'
import ProjectsPanel from '@/components/pages/admin/projects/ProjectsPanel'
import ApartmentsPanel from '@/components/pages/admin/apartments/ApartmentsPanel'

type MenuType = 'partners' | 'projects' | 'apartments'

export default function Admin() {
  // Initialize state from URL query params
  const [activeMenu, setActiveMenu] = useState<MenuType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab') as MenuType
      // Validate the tab value
      if (tab === 'partners' || tab === 'projects' || tab === 'apartments') {
        return tab
      }
    }
    return 'partners' // default value
  })

  // Update URL when activeMenu changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.set('tab', activeMenu)

      // Update URL without page reload
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({}, '', newUrl)
    }
  }, [activeMenu])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab') as MenuType
      if (tab === 'partners' || tab === 'projects' || tab === 'apartments') {
        setActiveMenu(tab)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="mt-6 space-y-1">
          {/* Partners Button */}
          <button
            onClick={() => setActiveMenu('partners')}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeMenu === 'partners'
                ? 'bg-gray-800 border-l-4 border-blue-500'
                : 'hover:bg-gray-800'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Partners
          </button>

          {/* Projects Button */}
          <button
            onClick={() => setActiveMenu('projects')}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeMenu === 'projects'
                ? 'bg-gray-800 border-l-4 border-blue-500'
                : 'hover:bg-gray-800'
            }`}
          >
            <Building className="w-5 h-5 mr-3" />
            Projects
          </button>

          {/* Apartments Button */}
          <button
            onClick={() => setActiveMenu('apartments')}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeMenu === 'apartments'
                ? 'bg-gray-800 border-l-4 border-blue-500'
                : 'hover:bg-gray-800'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Apartments
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeMenu === 'partners' && <PartnersPanel />}
        {activeMenu === 'projects' && <ProjectsPanel />}
        {activeMenu === 'apartments' && <ApartmentsPanel />}
      </div>
    </div>
  )
}
