'use client'

import { useState } from 'react'
import { Users, Building } from 'lucide-react'
import PartnersPanel from '@/components/pages/admin/partners/PartnersPanel'
import ProjectsPanel from '@/components/pages/admin/projects/ProjectsPanel' // ✅ Added import

export default function Admin() {
  const [activeMenu, setActiveMenu] = useState<'partners' | 'projects'>(
    'partners'
  )

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
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeMenu === 'partners' && <PartnersPanel />}
        {activeMenu === 'projects' && <ProjectsPanel />}
      </div>
    </div>
  )
}
