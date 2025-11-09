import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

type DropdownType =
  | 'propertyType'
  | 'location'
  | 'sqm'
  | 'rooms'
  | 'price'
  | null

interface Filters {
  propertyTypes: string[]
  locations: string[]
  sqmFrom: string
  sqmTo: string
  rooms: number[]
  priceFrom: string
  priceTo: string
  currency: 'USD' | 'GEL'
}

const PropertyFilter = () => {
  const [filters, setFilters] = useState<Filters>({
    propertyTypes: [],
    locations: [],
    sqmFrom: '',
    sqmTo: '',
    rooms: [],
    priceFrom: '',
    priceTo: '',
    currency: 'USD',
  })

  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)

  const propertyTypes: string[] = [
    'Apartment',
    'House',
    'Land',
    'Commercial',
    'Townhouse',
  ]

  const locations: string[] = [
    'Batumi',
    'Tbilisi',
    'Kutaisi',
    'Gori',
    'Zugdidi',
    'Kazbegi',
  ]

  const handlePropertyTypeChange = (type: string): void => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type],
    }))
  }

  const handleLocationChange = (loc: string): void => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter(l => l !== loc)
        : [...prev.locations, loc],
    }))
  }

  const handleRoomsChange = (room: number): void => {
    setFilters(prev => ({
      ...prev,
      rooms: prev.rooms.includes(room)
        ? prev.rooms.filter(r => r !== room)
        : [...prev.rooms, room],
    }))
  }

  const handleSqmChange = (field: 'sqmFrom' | 'sqmTo', value: string): void => {
    setFilters({ ...filters, [field]: value })
  }

  const handlePriceChange = (
    field: 'priceFrom' | 'priceTo',
    value: string
  ): void => {
    setFilters({ ...filters, [field]: value })
  }

  const handleCurrencyChange = (curr: 'USD' | 'GEL'): void => {
    setFilters({ ...filters, currency: curr })
  }

  const toggleDropdown = (name: DropdownType): void => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const handleReset = (): void => {
    setFilters({
      propertyTypes: [],
      locations: [],
      sqmFrom: '',
      sqmTo: '',
      rooms: [],
      priceFrom: '',
      priceTo: '',
      currency: 'USD',
    })
    setOpenDropdown(null)
  }

  const getButtonLabel = (type: string): string => {
    switch (type) {
      case 'propertyType':
        if (filters.propertyTypes.length > 0) {
          return `Type: ${filters.propertyTypes.join(', ')}`
        }
        return 'Property Type'
      case 'location':
        if (filters.locations.length > 0) {
          return `Location: ${filters.locations.join(', ')}`
        }
        return 'Location'
      case 'sqm':
        if (filters.sqmFrom || filters.sqmTo) {
          return `SQM: ${filters.sqmFrom || '0'} - ${filters.sqmTo || '∞'}`
        }
        return 'SQM'
      case 'rooms':
        if (filters.rooms.length > 0) {
          return `Rooms: ${filters.rooms.sort((a, b) => a - b).join(', ')}`
        }
        return 'Rooms'
      case 'price':
        if (filters.priceFrom || filters.priceTo) {
          return `${filters.currency}: ${filters.priceFrom || '0'} - ${filters.priceTo || '∞'}`
        }
        return `Price (${filters.currency})`
      default:
        return ''
    }
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Find Your Perfect Property
        </h2>

        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.03)] p-4 sm:p-6">
          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="flex flex-wrap gap-3 items-start">
              {/* Property Type Button */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('propertyType')}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{getButtonLabel('propertyType')}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openDropdown === 'propertyType' ? 'rotate-180' : ''}`}
                  />
                </button>

                {openDropdown === 'propertyType' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 min-w-[240px]">
                    <label className="text-xs font-medium text-gray-600 block mb-3">
                      Property Types
                    </label>
                    <div className="space-y-2">
                      {propertyTypes.map(type => (
                        <label
                          key={type}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={filters.propertyTypes.includes(type)}
                            onChange={() => handlePropertyTypeChange(type)}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location Button */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('location')}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{getButtonLabel('location')}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`}
                  />
                </button>

                {openDropdown === 'location' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 min-w-[240px]">
                    <label className="text-xs font-medium text-gray-600 block mb-3">
                      Locations
                    </label>
                    <div className="space-y-2">
                      {locations.map(loc => (
                        <label
                          key={loc}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={filters.locations.includes(loc)}
                            onChange={() => handleLocationChange(loc)}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {loc}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SQM Button */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('sqm')}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{getButtonLabel('sqm')}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openDropdown === 'sqm' ? 'rotate-180' : ''}`}
                  />
                </button>

                {openDropdown === 'sqm' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 min-w-[280px]">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">
                          SQM From
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="From"
                          value={filters.sqmFrom}
                          onChange={e =>
                            handleSqmChange('sqmFrom', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">
                          SQM To
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="To"
                          value={filters.sqmTo}
                          onChange={e =>
                            handleSqmChange('sqmTo', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rooms Button */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('rooms')}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{getButtonLabel('rooms')}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openDropdown === 'rooms' ? 'rotate-180' : ''}`}
                  />
                </button>

                {openDropdown === 'rooms' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                    <label className="text-xs font-medium text-gray-600 block mb-3">
                      Number of Rooms
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map(room => (
                        <button
                          key={room}
                          onClick={() => handleRoomsChange(room)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all text-sm ${
                            filters.rooms.includes(room)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-blue-400'
                          }`}
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Button */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('price')}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{getButtonLabel('price')}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`}
                  />
                </button>

                {openDropdown === 'price' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 min-w-[280px]">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">
                          Currency
                        </label>
                        <select
                          value={filters.currency}
                          onChange={e =>
                            handleCurrencyChange(
                              e.target.value as 'USD' | 'GEL'
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        >
                          <option value="USD">USD</option>
                          <option value="GEL">GEL</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">
                          Price From
                        </label>
                        <input
                          type="number"
                          placeholder="From"
                          value={filters.priceFrom}
                          onChange={e =>
                            handlePriceChange('priceFrom', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">
                          Price To
                        </label>
                        <input
                          type="number"
                          placeholder="To"
                          value={filters.priceTo}
                          onChange={e =>
                            handlePriceChange('priceTo', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center ml-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden space-y-4">
            {/* Property Type Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('propertyType')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-all flex items-center justify-between"
              >
                <span>{getButtonLabel('propertyType')}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${openDropdown === 'propertyType' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'propertyType' && (
                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <label className="text-xs font-medium text-gray-600 block mb-3">
                    Property Types
                  </label>
                  <div className="space-y-2">
                    {propertyTypes.map(type => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.propertyTypes.includes(type)}
                          onChange={() => handlePropertyTypeChange(type)}
                          className="w-5 h-5 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('location')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-all flex items-center justify-between"
              >
                <span>{getButtonLabel('location')}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'location' && (
                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <label className="text-xs font-medium text-gray-600 block mb-3">
                    Locations
                  </label>
                  <div className="space-y-2">
                    {locations.map(loc => (
                      <label
                        key={loc}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.locations.includes(loc)}
                          onChange={() => handleLocationChange(loc)}
                          className="w-5 h-5 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {loc}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SQM Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('sqm')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-all flex items-center justify-between"
              >
                <span>{getButtonLabel('sqm')}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${openDropdown === 'sqm' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'sqm' && (
                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      SQM From
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="From"
                      value={filters.sqmFrom}
                      onChange={e => handleSqmChange('sqmFrom', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      SQM To
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="To"
                      value={filters.sqmTo}
                      onChange={e => handleSqmChange('sqmTo', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rooms Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('rooms')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-all flex items-center justify-between"
              >
                <span>{getButtonLabel('rooms')}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${openDropdown === 'rooms' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'rooms' && (
                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <label className="text-xs font-medium text-gray-600 block mb-3">
                    Number of Rooms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map(room => (
                      <button
                        key={room}
                        onClick={() => handleRoomsChange(room)}
                        className={`w-12 h-12 rounded-lg font-bold transition-all ${
                          filters.rooms.includes(room)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
                        }`}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('price')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-all flex items-center justify-between"
              >
                <span>{getButtonLabel('price')}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'price' && (
                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      Currency
                    </label>
                    <select
                      value={filters.currency}
                      onChange={e =>
                        handleCurrencyChange(e.target.value as 'USD' | 'GEL')
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                    >
                      <option value="USD">USD</option>
                      <option value="GEL">GEL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      Price From
                    </label>
                    <input
                      type="number"
                      placeholder="From"
                      value={filters.priceFrom}
                      onChange={e =>
                        handlePriceChange('priceFrom', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      Price To
                    </label>
                    <input
                      type="number"
                      placeholder="To"
                      value={filters.priceTo}
                      onChange={e =>
                        handlePriceChange('priceTo', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyFilter
