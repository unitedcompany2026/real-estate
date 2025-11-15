import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Building2,
  HardHat,
  Home,
  Building,
  MapPin,
  Search,
} from 'lucide-react'

export default function Cover() {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white py-12">
      <div className=" ">
        {/* Main Grid - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Card - Search/Explore */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-3">
              {t('cover.exploreTitle')}
            </h1>
            <p className="text-blue-100 mb-6 text-lg">
              {t('cover.exploreDescription')}
            </p>

            {/* Search Filters */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-3">
                {/* Property Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    {t('search.propertyType')}
                  </label>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option>{t('search.allTypes')}</option>
                    <option>{t('search.apartment')}</option>
                    <option>{t('search.house')}</option>
                    <option>{t('search.commercial')}</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    {t('search.location')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('search.locationPlaceholder')}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    {t('search.rooms')}
                  </label>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option>{t('search.any')}</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100 shadow-sm hover:shadow-md h-12 px-6 rounded-lg w-full">
              <Search className="w-4 h-4" />
              {t('search.search')}
            </button>
          </div>

          {/* Right Card - Add Property */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {t('cover.sellTitle')}
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {t('cover.sellDescription')}
            </p>

            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-800 text-white hover:bg-gray-900 active:bg-black shadow-sm hover:shadow-md h-12 px-6 rounded-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t('cover.addProperty')}
            </button>

            {/* Decorative illustration placeholder */}
            <div className="mt-6 flex justify-end">
              <div className="w-48 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <Home className="w-16 h-16 text-blue-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards Grid - 5 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Construction Projects */}
          <Link
            to="/projects"
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 mb-3">
                <HardHat className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {t('categories.constructionProjects')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('categories.projectsCount', { count: 13 })}
              </p>
            </div>
          </Link>

          {/* Apartments from Developers */}
          <Link
            to="/apartments"
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 mb-3">
                <Building2 className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {t('categories.apartmentsFromDevelopers')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('categories.apartmentsCount', { count: 408 })}
              </p>
            </div>
          </Link>

          {/* Residential Apartments */}
          <Link
            to="/residential"
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 mb-3">
                <Home className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {t('categories.residentialApartments')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('categories.residentialCount', { count: 156 })}
              </p>
            </div>
          </Link>

          {/* Commercial Properties */}
          <Link
            to="/commercial"
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 mb-3">
                <Building className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {t('categories.commercialProperties')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('categories.commercialCount', { count: 42 })}
              </p>
            </div>
          </Link>

          {/* Lands for Sale */}
          <Link
            to="/lands"
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 mb-3">
                <MapPin className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {t('categories.landsForSale')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('categories.landsCount', { count: 28 })}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
