import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

type Currency = 'USD' | 'GEL'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRate: number
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
)

const STORAGE_KEY = 'preferred-currency'
const CACHE_KEY = 'exchange-rate-cache'
const CACHE_DURATION = 3600000

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'USD' || stored === 'GEL' ? stored : 'USD'
  })

  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { rate, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return rate
        }
      } catch (e) {
        console.error('Failed to parse cached exchange rate:', e)
      }
    }
    return 2.8
  })

  const [isLoading, setIsLoading] = useState(true)

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(STORAGE_KEY, newCurrency)
  }

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        )
        const data = await response.json()

        if (data.rates && data.rates.GEL) {
          const rate = data.rates.GEL
          setExchangeRate(rate)
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              rate,
              timestamp: Date.now(),
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const cached = localStorage.getItem(CACHE_KEY)
    let shouldFetch = true

    if (cached) {
      try {
        const { timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          shouldFetch = false
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to parse cached data:', e)
      }
    }

    if (shouldFetch) {
      fetchExchangeRate()
    }

    const interval = setInterval(fetchExchangeRate, CACHE_DURATION)

    return () => clearInterval(interval)
  }, [])

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, exchangeRate, isLoading }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
