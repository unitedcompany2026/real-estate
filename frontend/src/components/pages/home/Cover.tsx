import React from 'react'

export default function Cover() {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden bg-white">
      <img
        src="./Cover.jpg"
        alt="Cover"
        className="absolute inset-0 w-full h-full object-cover object-bottom"
      />

      {/* Fade to white at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-70% to-white" />

      {/* Compact Search Filter - One Card */}
      <div className="absolute top-20 left-12 w-[45%] bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Property Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Property Type
            </label>
            <select className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Types</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Rooms
            </label>
            <select className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Any</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4+</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Price Range
            </label>
            <select className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Any Price</option>
              <option>$0 - $100k</option>
              <option>$100k - $300k</option>
              <option>$300k - $500k</option>
              <option>$500k+</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-1.5 rounded-md transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
