import { ArrowRight, ArrowLeft, Users, Heart, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Home = ({ onStartApplication }) => {
  const { t, i18n } = useTranslation()

  return (
    <div className='mx-auto px-4'>
      {/* Hero Section */}
      <div className='text-center py-8 sm:py-12 lg:py-16'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight'>
          {t('home.title')}
        </h1>
        <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto'>
          {t('home.subtitle')}
        </p>

        <button
          onClick={onStartApplication}
          className='inline-flex items-center px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-accent-300 to-accent-400 hover:from-accent-400 hover:to-accent-500 text-white font-semibold rounded-full focus:outline-none focus:ring-4 focus:ring-accent-200/50 focus:ring-offset-2 transition-all duration-300 text-lg sm:text-xl shadow-2xl hover:shadow-accent-200/25 hover:scale-110 min-h-[52px] transform group relative overflow-hidden shimmer-button'
          aria-label={t('home.startApplication')}
        >
          {t('home.startApplication')}
          {i18n.language === 'ar' ? (
            <ArrowLeft
              className='rtl:mr-2 rtl:sm:mr-3 ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-1 drop-shadow-sm'
              aria-hidden='true'
            />
          ) : (
            <ArrowRight
              className='rtl:mr-2 rtl:sm:mr-3 ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1 drop-shadow-sm'
              aria-hidden='true'
            />
          )}
        </button>
      </div>

      {/* Features */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-4 sm:py-16'>
        <div className='text-center'>
          <div className='w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Users className='w-6 h-6 text-gray-600 dark:text-gray-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            {t('home.features.community.title')}
          </h3>
          <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
            {t('home.features.community.description')}
          </p>
        </div>

        <div className='text-center'>
          <div className='w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Heart className='w-6 h-6 text-gray-600 dark:text-gray-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            {t('home.features.support.title')}
          </h3>
          <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
            {t('home.features.support.description')}
          </p>
        </div>

        <div className='text-center'>
          <div className='w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Zap className='w-6 h-6 text-gray-600 dark:text-gray-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            {t('home.features.growth.title')}
          </h3>
          <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
            {t('home.features.growth.description')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
