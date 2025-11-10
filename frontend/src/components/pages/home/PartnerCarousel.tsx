import { useTranslation } from 'react-i18next'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import PartnerCard from '../partners/PartnerCard'

interface PartnersCarouselProps {
  companies: Array<{
    id: number
    companyName: string
    image: string
  }>
}

const PartnersCarousel = ({ companies }: PartnersCarouselProps) => {
  const { t } = useTranslation()

  if (!companies || companies.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <div className="w-full">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t('partners.title')}
          </h1>
          <a
            href="/partners"
            className="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            {t('common.seeAll')} →
          </a>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="my-7">
            {companies.map(company => (
              <CarouselItem
                key={company.id}
                className="cursor-default basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <PartnerCard company={company} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="    md:flex bg-gray-100" />
          <CarouselNext className=" md:flex bg-gray-100" />
        </Carousel>
      </div>
    </div>
  )
}

export default PartnersCarousel
