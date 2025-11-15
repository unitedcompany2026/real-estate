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
const TERMS_URL = '#'
const CONFIDENTIAL_URL = '#'

export default function Footer() {
  const pathname = window.location.pathname

  // Hide footer on admin pages
  const isAdminPath = pathname.includes('/admin')

  if (isAdminPath) {
    return null
  }

  const isLandlordsPath =
    pathname.includes('/landlords') ||
    pathname.includes('/upload-property') ||
    pathname.includes('/property-list') ||
    pathname.includes('/landlord-profile')

  return (
    <div className="flex flex-col w-full pt-12 bg-blue-400">
      <div>
        <div className="flex flex-col px-6 sm:px-16 md:flex-row md:items-start md:justify-between md:px-20 xl:px-24">
          <a href={isLandlordsPath ? '/landlords' : '/'}>
            <Logo
              className={`${
                isLandlordsPath ? 'fill-mainOrange' : 'fill-white'
              } h-6 w-[120px] cursor-pointer md:h-9 md:w-[140px] xl:h-10 xl:w-[200px]`}
            />
          </a>

          {/* ✅ Navigation links */}
          <div className="mt-8 flex flex-col gap-y-4 md:mt-0">
            <a href="/">
              <span
                className="text-xs hover:underline text-white bg-white bg-opacity-20 px-3 py-1 rounded"
                style={{
                  fontWeight: pathname === '/' ? 'bold' : '',
                }}
              >
                Home
              </span>
            </a>
            <div className="grid gap-y-4 lg:grid-cols-2 lg:gap-x-20">
              <a href="/properties">
                <span
                  className="text-xs hover:underline text-white bg-white bg-opacity-20 px-3 py-1 rounded"
                  style={{
                    fontWeight: pathname === '/properties' ? 'bold' : '',
                  }}
                >
                  Browse Properties
                </span>
              </a>
              <a href="/agents">
                <span
                  className="text-xs hover:underline text-white bg-white bg-opacity-20 px-3 py-1 rounded"
                  style={{
                    fontWeight: pathname === '/agents' ? 'bold' : '',
                  }}
                >
                  Find Agent
                </span>
              </a>
              <a href="/blog">
                <span className="text-xs hover:underline text-white bg-white bg-opacity-20 px-3 py-1 rounded">
                  Blog
                </span>
              </a>
              <a href="/how-it-works">
                <span className="text-xs hover:underline text-white bg-white bg-opacity-20 px-3 py-1 rounded">
                  How It Works
                </span>
              </a>
            </div>
          </div>

          {/* ✅ Contact info */}
          <div className="mt-8 flex flex-col md:mt-0">
            <h1 className="text-xs font-semibold text-white">Contact</h1>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-1">
              <a href={`tel:${CONTACT_PHONE}`}>
                <div className="flex flex-row items-center rounded-lg bg-white bg-opacity-90 px-2 py-3 hover:bg-opacity-100 transition-all">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="ml-2 text-xs text-blue-900 font-medium">
                    {CONTACT_PHONE}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 hidden h-[1px] w-full bg-white bg-opacity-40 lg:block"></div>

        {/* Bottom section */}
        <div className="flex flex-col px-6 sm:px-16 md:px-20 md:py-4 lg:flex-row lg:items-center lg:justify-between xl:px-24">
          <div className="hidden flex-row gap-x-4 lg:flex">
            <a target="_blank" href={TERMS_URL}>
              <span className="text-xs hover:underline text-white bg-white bg-opacity-20 px-3 py-1 rounded">
                Terms & Conditions
              </span>
            </a>
            <div className="h-3 w-[1px] bg-white bg-opacity-40"></div>
            <a target="_blank" href={CONFIDENTIAL_URL}>
              <span className="text-xs hover:underline text-white bg-white bg-opacity-20 px-3 py-1 rounded">
                Privacy Policy
              </span>
            </a>
          </div>

          <div className="mt-8 flex flex-col md:mt-0 lg:order-2">
            <SocialIcons />
          </div>

          <div className="mt-8 h-[1px] w-full bg-white bg-opacity-40 lg:mt-0 lg:hidden"></div>
        </div>

        {/* Copyright */}
        <div className="mt-4 flex flex-row items-center justify-around bg-white bg-opacity-30 px-6 py-4 sm:px-16 md:px-20 lg:justify-center xl:px-24">
          <p className="text-[8px] text-white font-semibold">
            © 2024 DreamHome Real Estate
          </p>
          <div className="h-3 w-[1px] bg-white bg-opacity-40 lg:hidden"></div>
          <p className="text-[8px] text-white font-semibold lg:hidden">
            Terms & Conditions
          </p>
          <div className="h-3 w-[1px] bg-white bg-opacity-40 lg:hidden"></div>
          <p className="text-[8px] text-white font-semibold lg:hidden">
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
