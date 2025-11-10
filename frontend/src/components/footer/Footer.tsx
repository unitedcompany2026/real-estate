import { useTranslation } from 'react-i18next'

// Mock icons/components
const Logo = ({ className }: { className?: string }) => (
  <div className={className}>Logo</div>
)
const PhoneIcon = ({ className }: { className?: string }) => (
  <span className={className}>📞</span>
)
const SocialIcons = () => (
  <div className="flex gap-2">
    <span>🐦</span>
    <span>📘</span>
    <span>📸</span>
  </div>
)

// Mock constants
const CONTACT_PHONE = '+123456789'
const TERMS_EN_URL = '#'
const TERMS_KA_URL = '#'
const CONFIDENTIAL_EN_URL = '#'
const CONFIDENTIAL_KA_URL = '#'

export default function Footer() {
  const { t } = useTranslation()
  const pathname = window.location.pathname
  const localePattern = /^\/(en|ka)(\/|$)/
  const pathnameWithoutLocale = pathname.replace(localePattern, '/')
  const isLandlordsPath =
    pathname.includes('/landlords') ||
    pathname.includes('/upload-apartment') ||
    pathname.includes('/apartment-list') ||
    pathname.includes('/landlord-profile')

  return (
    <div className="flex flex-col w-full pt-12 bg-white">
      <div className="flex flex-col px-6 sm:px-16 md:flex-row md:items-start md:justify-between md:px-20 xl:px-24">
        <a href={isLandlordsPath ? '/landlords' : '/'}>
          <Logo
            className={`${
              isLandlordsPath ? 'fill-mainOrange' : 'fill-mainGreen'
            } h-6 w-[120px] cursor-pointer md:h-9 md:w-[140px] xl:h-10 xl:w-[200px]`}
          />
        </a>

        <div className="mt-8 flex flex-col gap-y-4 md:mt-0">
          <a href="/">
            <span
              className="text-xs hover:underline"
              style={{
                fontWeight: pathnameWithoutLocale === '/' ? 'bold' : '',
              }}
            >
              {t('main')}
            </span>
          </a>
          <div className="grid gap-y-4 lg:grid-cols-2 lg:gap-x-20">
            <a href="/roommates">
              <span
                className="text-xs hover:underline"
                style={{
                  fontWeight:
                    pathnameWithoutLocale === '/roommates' ? 'bold' : '',
                }}
              >
                {t('findRoommate')}
              </span>
            </a>
            <a href="/apartments">
              <span
                className="text-xs hover:underline"
                style={{
                  fontWeight:
                    pathnameWithoutLocale === '/apartments' ? 'bold' : '',
                }}
              >
                {t('rentApartment')}
              </span>
            </a>
            <a href="/blog">
              <span className="text-xs hover:underline">{t('blog')}</span>
            </a>
            <a href="/">
              <span className="text-xs hover:underline">{t('howItWorks')}</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:mt-0">
          <h1 className="text-xs font-semibold">{t('contact')}</h1>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-1">
            <a href={`tel:${CONTACT_PHONE}`}>
              <div className="flex flex-row items-center rounded-lg bg-[#F2F5FF] px-2 py-3">
                <PhoneIcon className="h-4 w-4" />
                <span className="ml-2 text-xs">{CONTACT_PHONE}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 hidden h-[1px] w-full bg-[#7D7D7D] lg:block"></div>

      <div className="flex flex-col px-6 sm:px-16 md:px-20 md:py-4 lg:flex-row lg:items-center lg:justify-between xl:px-24">
        <div className="hidden flex-row gap-x-4 lg:flex">
          <a target="_blank" href={TERMS_EN_URL}>
            <span className="text-xs hover:underline">{t('terms')}</span>
          </a>
          <div className="h-3 w-[1px] bg-[#7D7D7D]"></div>
          <a target="_blank" href={CONFIDENTIAL_EN_URL}>
            <span className="text-xs hover:underline">{t('confidencial')}</span>
          </a>
        </div>

        <div className="mt-8 flex flex-col md:mt-0 lg:order-2">
          <SocialIcons />
        </div>

        <div className="mt-8 h-[1px] w-full bg-[#7D7D7D] lg:mt-0 lg:hidden"></div>
      </div>

      <div className="mt-4 flex flex-row items-center justify-around bg-[#F2F5FF] px-6 py-4 sm:px-16 md:px-20 lg:justify-center xl:px-24">
        <p className="text-[8px]">Copyright 2024</p>
        <div className="h-3 w-[1px] bg-[#7D7D7D] lg:hidden"></div>
        <p className="text-[8px] lg:hidden">{t('terms')}</p>
        <div className="h-3 w-[1px] bg-[#7D7D7D] lg:hidden"></div>
        <p className="text-[8px] lg:hidden">{t('confidencial')}</p>
      </div>
    </div>
  )
}
