import CompanyCarousel from '@/components/pages/home/PartnerCarousel'
import PropertyCarousel from '@/components/pages/home/PropertyCarousel'
import PropertyFilter from '@/components/pages/properties/PropertyFilter'

export default function Home() {
  return (
    <div>
      <PropertyFilter />
      <PropertyCarousel />
      <CompanyCarousel />
    </div>
  )
}
