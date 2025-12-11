import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'ka', name: 'ქართული', flag: 'GE' },
  { code: 'ru', name: 'Русский', flag: 'RU' },
  { code: 'ar', name: 'العربية', flag: 'AR' },
  { code: 'he', name: 'עברית', flag: 'IS' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const currentLanguage =
    languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2.5 gap-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-44 shadow-2xl cursor-pointer"
      >
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={
              i18n.language === lang.code
                ? 'bg-blue-50 text-blue-600 font-medium cursor-pointer'
                : 'hover:bg-gray-50 cursor-pointer'
            }
          >
            <span className="mr-2 text-base">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
