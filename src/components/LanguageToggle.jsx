import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { useEffect } from 'react'

const LanguageToggle = () => {
  const { i18n } = useTranslation()

  // Initialize HTML attributes and body class on mount
  useEffect(() => {
    const currentLang = i18n.language || 'en'
    document.documentElement.lang = currentLang
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'

    // Update body font class
    if (currentLang === 'ar') {
      document.body.classList.add('font-arabic')
    } else {
      document.body.classList.remove('font-arabic')
    }
  }, [i18n.language])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)

    // Update HTML attributes
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'

    // Update body font class
    if (newLang === 'ar') {
      document.body.classList.add('font-arabic')
    } else {
      document.body.classList.remove('font-arabic')
    }

    // Store in localStorage
    localStorage.setItem('i18nextLng', newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      aria-label={`Switch to ${i18n.language === 'en' ? 'Arabic' : 'English'}`}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg 
        bg-gray-100 dark:bg-gray-800 
        text-gray-900 dark:text-white
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        transition-colors duration-200
        border border-gray-200 dark:border-gray-700
        text-sm font-medium
      `}
    >
      <Globe className='w-4 h-4' />
      <span className='rtl:font-arabic'>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  )
}

export default LanguageToggle
