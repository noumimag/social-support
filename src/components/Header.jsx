import { HandHeart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

const Header = () => {
  const { t } = useTranslation()

  return (
    <header
      className='
      bg-gray-200 dark:bg-gray-800 
      border-b border-gray-300 dark:border-gray-700
      shadow-sm sticky top-0 z-50
    '
      role='banner'
    >
      <div className='container mx-auto px-4 py-2 sm:py-3'>
        <div className='flex items-center justify-between'>
          <Link
            to='/'
            className='flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none rounded-lg p-1 rtl:flex-row-reverse'
            aria-label={`${t('header.title')} - ${t('header.goToHomepage')}`}
          >
            <HandHeart
              className='h-6 w-6 sm:h-10 sm:w-10 text-accent-400 dark:text-accent-400 rtl:order-2'
              aria-hidden='true'
            />
            <h1 className='text-md sm:text-xl ltr:lg:text-2xl font-bold text-gray-900 dark:text-white rtl:order-1'>
              {t('header.title')}
            </h1>
          </Link>
          <div className='flex items-center gap-2'>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
