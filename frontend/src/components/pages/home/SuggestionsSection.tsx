import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function SuggestSection() {
  const data = [
    {
      header: 'Hassle-Free Experience',
      text: 'From listing your property to signing the contract — we handle every step smoothly, saving you time and effort.',
    },
    {
      header: 'Find Roommates Easily',
      text: 'Looking for the perfect roommate? Our smart matching system connects you with reliable people who share your lifestyle.',
    },
    {
      header: 'Seamless Home Listings',
      text: 'List your property in just minutes with high-quality photos, detailed descriptions, and instant visibility to thousands of potential renters or buyers.',
    },
    {
      header: 'Smart Search & Filters',
      text: 'Discover homes tailored to your needs with our advanced search filters — by location, price, size, or amenities.',
    },
  ]

  return (
    <section className="flex w-full flex-col items-start bg-[#F2F5FF] p-6 sm:px-16 md:px-20 lg:flex-row lg:items-center lg:py-12 xl:px-24">
      <div className="flex flex-col items-start lg:w-2/3">
        <h1 className="font-bgCaps text-2xl text-[#484848] lg:text-[28px]">
          Why Choose Us
        </h1>
      </div>

      <div className="w-full mt-6 lg:hidden">
        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="my-4 mx-5">
            {data.map((item, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/2"
              >
                <div className="flex h-full w-full flex-col items-start rounded-xl bg-[#c0dbfc] py-4 pr-8">
                  <p className="mt-4 text-sm font-semibold">{item.header}</p>
                  <p className="mt-2 text-xs text-gray-700">{item.text}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="bg-white shadow-md" />
          <CarouselNext className="bg-white shadow-md" />
        </Carousel>
      </div>

      <div className="hidden w-full grid-cols-2 gap-6 lg:grid">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-start rounded-xl border-b-[3px] border-[#7D9BFD] bg-white py-8 pl-8 pr-14"
          >
            <h1 className="mt-6 text-left font-semibold text-[#484848]">
              {item.header}
            </h1>
            <h2 className="mt-2 text-left text-gray-600">{item.text}</h2>
          </div>
        ))}
      </div>
    </section>
  )
}
