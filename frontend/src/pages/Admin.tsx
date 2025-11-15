import { useState, useEffect } from 'react'
import { Users, Building, Home, LogOut } from 'lucide-react'
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

  // Reset scroll to top when changing tabs
  useEffect(() => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeMenu])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed left-0 top-0 h-screen flex flex-col shadow-2xl z-50">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-gray-400 text-sm mt-1">Management Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {/* Partners Button */}
          <button
            onClick={() => setActiveMenu('partners')}
            className={`w-full flex items-center px-4 py-3.5 rounded-lg text-left transition-all duration-200 group ${
              activeMenu === 'partners'
                ? 'bg-blue-600 shadow-lg shadow-blue-600/50 text-white'
                : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
            }`}
          >
            <Users
              className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                activeMenu === 'partners'
                  ? 'scale-110'
                  : 'group-hover:scale-110'
              }`}
            />
            <span className="font-medium">Partners</span>
          </button>

          {/* Projects Button */}
          <button
            onClick={() => setActiveMenu('projects')}
            className={`w-full flex items-center px-4 py-3.5 rounded-lg text-left transition-all duration-200 group ${
              activeMenu === 'projects'
                ? 'bg-blue-600 shadow-lg shadow-blue-600/50 text-white'
                : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
            }`}
          >
            <Building
              className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                activeMenu === 'projects'
                  ? 'scale-110'
                  : 'group-hover:scale-110'
              }`}
            />
            <span className="font-medium">Projects</span>
          </button>

          {/* Apartments Button */}
          <button
            onClick={() => setActiveMenu('apartments')}
            className={`w-full flex items-center px-4 py-3.5 rounded-lg text-left transition-all duration-200 group ${
              activeMenu === 'apartments'
                ? 'bg-blue-600 shadow-lg shadow-blue-600/50 text-white'
                : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
            }`}
          >
            <Home
              className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                activeMenu === 'apartments'
                  ? 'scale-110'
                  : 'group-hover:scale-110'
              }`}
            />
            <span className="font-medium">Apartments</span>
          </button>
        </nav>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-left text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group">
            <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area with proper offset */}
      <main
        id="main-content"
        className="flex-1 ml-64 min-h-screen overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto p-8">
          {/* Content Panels */}
          <div className="bg-white rounded-xl shadow-sm p-8 min-h-[calc(100vh-4rem)]">
            {activeMenu === 'partners' && <PartnersPanel />}
            {activeMenu === 'projects' && <ProjectsPanel />}
            {activeMenu === 'apartments' && <ApartmentsPanel />}
          </div>
        </div>
      </main>
    </div>
  )
}
