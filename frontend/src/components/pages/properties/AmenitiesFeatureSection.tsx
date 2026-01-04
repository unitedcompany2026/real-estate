import type { Property } from '@/lib/types/properties'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AmenitiesFeaturesSectionProps {
  property: Property
}

export function AmenitiesFeaturesSection({
  property,
}: AmenitiesFeaturesSectionProps) {
  const { t } = useTranslation()

  const amenities = [
    { key: 'hasConditioner', label: t('property.amenities.conditioner') },
    { key: 'hasFurniture', label: t('property.amenities.furniture') },
    { key: 'hasBed', label: t('property.amenities.bed') },
    { key: 'hasSofa', label: t('property.amenities.sofa') },
    { key: 'hasTable', label: t('property.amenities.table') },
    { key: 'hasChairs', label: t('property.amenities.chairs') },
    { key: 'hasStove', label: t('property.amenities.stove') },
    { key: 'hasRefrigerator', label: t('property.amenities.refrigerator') },
    { key: 'hasOven', label: t('property.amenities.oven') },
    { key: 'hasWashingMachine', label: t('property.amenities.washingMachine') },
    {
      key: 'hasKitchenAppliances',
      label: t('property.amenities.kitchenAppliances'),
    },
    { key: 'hasBalcony', label: t('property.amenities.balcony') },
    { key: 'hasNaturalGas', label: t('property.amenities.naturalGas') },
    { key: 'hasInternet', label: t('property.amenities.internet') },
    { key: 'hasTV', label: t('property.amenities.tv') },
    { key: 'hasSewerage', label: t('property.amenities.sewerage') },
    { key: 'isFenced', label: t('property.amenities.fenced') },
    { key: 'hasYardLighting', label: t('property.amenities.yardLighting') },
    { key: 'hasGrill', label: t('property.amenities.grill') },
    { key: 'hasAlarm', label: t('property.amenities.alarm') },
    { key: 'hasVentilation', label: t('property.amenities.ventilation') },
    { key: 'hasWater', label: t('property.amenities.water') },
    { key: 'hasElectricity', label: t('property.amenities.electricity') },
    { key: 'hasGate', label: t('property.amenities.gate') },
  ]

  const availableAmenities = amenities.filter(
    amenity => property[amenity.key as keyof Property] === true
  )

  if (availableAmenities.length === 0) return null

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">
        {t('property.amenitiesTitle')}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-2.5">
        {availableAmenities.map(amenity => (
          <div
            key={amenity.key}
            className="flex items-center gap-1.5 md:gap-2 text-green-700"
          >
            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
            <span className="text-xs md:text-sm">{amenity.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
