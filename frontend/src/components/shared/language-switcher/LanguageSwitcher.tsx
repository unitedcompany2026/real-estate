import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  const currentLanguage =
    languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('preferredLanguage', langCode)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 border border-gray-200 hover:border-blue-300 rounded-lg transition-all"
        >
          <span className="text-lg leading-none">{currentLanguage.flag}</span>
          <span className="text-sm font-medium uppercase">
            {currentLanguage.code}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[180px] shadow-xl border-gray-200"
      >
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              'cursor-pointer py-2.5 px-3 flex items-center gap-3 transition-colors',
              i18n.language === lang.code
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'hover:bg-gray-50 text-gray-700'
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm">{lang.name}</span>
              <span className="text-xs opacity-60 uppercase">{lang.code}</span>
            </div>
            {i18n.language === lang.code && (
              <div className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')
