import { Switch } from '@/components/ui/switch'
import {
  ArrowUpRight,
  Bed,
  Calendar,
  DoorOpen,
  Home,
  MapPin,
} from 'lucide-react'

type Currency = 'USD' | 'GEL'

interface Property {
  image: string
  priceUSD: number
  priceGEL: number
  location: string
  floor: number
  rooms: number
  bedrooms: number
  dateAdded: string
}

interface PropertyCardProps {
  property: Property
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (priceUSD: number, priceGEL: number) => string
  formatDate: (dateString: string) => string
}

const PropertyCard = ({
  property,
  currency,
  setCurrency,
  formatPrice,
  formatDate,
}: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.03)] transition-all duration-300 h-full">
      <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-xl">
        <img
          src={property.image || '/placeholder.svg'}
          alt={property.location}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-blue-900 transition-colors cursor-pointer group/icon shadow-md">
          <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover/icon:text-white transition-colors" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {formatPrice(property.priceUSD, property.priceGEL)}
          </h3>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-medium ${currency === 'USD' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              USD
            </span>
            <Switch
              checked={currency === 'GEL'}
              onCheckedChange={(checked: boolean) =>
                setCurrency(checked ? 'GEL' : 'USD')
              }
              className="scale-75"
            />
            <span
              className={`text-xs font-medium ${currency === 'GEL' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              GEL
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="mr-1">Floor</span>
              <span className="font-medium">{property.floor}</span>
            </div>
            <div className="flex items-center">
              <DoorOpen className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="mr-1">Rooms</span>
              <span className="font-medium">{property.rooms}</span>
            </div>
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="mr-1">Beds</span>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-500 text-xs pt-2 border-t border-gray-100">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>{formatDate(property.dateAdded)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
