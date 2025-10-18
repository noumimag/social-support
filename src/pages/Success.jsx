import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetForm } from '../store/formSlice'
import { clearFormData } from '../services/storage'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Success = ({ onBackToHome }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const { isFormSubmitted } = useSelector(state => state.form)

  useEffect(() => {
    // Check if user is authorized to view this page
    if (isFormSubmitted) {
      setIsAuthorized(true)
      // Auto-redirect to home after 10 seconds for successful submissions
      const timer = setTimeout(() => {
        onBackToHome()
      }, 10000)

      return () => clearTimeout(timer)
    } else {
      // Redirect to home if not authorized
      setTimeout(() => {
        onBackToHome()
      }, 5000)
    }
  }, [isFormSubmitted, onBackToHome])

  // Reset form state and clear storage when component unmounts (user goes back to home)
  useEffect(() => {
    return () => {
      if (isFormSubmitted) {
        dispatch(resetForm())
        clearFormData()
      }
    }
  }, [isFormSubmitted, dispatch])

  if (!isAuthorized) {
    return (
      <div className='mx-auto text-center'>
        <div className='mb-8'>
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4'>
            <svg
              className='h-6 w-6 text-red-600 dark:text-red-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            {t('common.error')}
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>{t('success.accessDenied')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto text-center'>
      <div className='mb-8'>
        <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6'>
          <svg
            className='h-8 w-8 text-green-600 dark:text-green-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
          {t('success.title')}
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>{t('success.subtitle')}</p>
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
          {t('success.redirectMessage')}
        </p>
        <button
          onClick={onBackToHome}
          className='inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent-300 to-accent-400 hover:from-accent-400 hover:to-accent-500 text-white font-semibold rounded-full focus:outline-none focus:ring-4 focus:ring-accent-200/50 focus:ring-offset-2 transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-accent-200/25 hover:scale-105 min-h-[44px] transform group relative overflow-hidden shimmer-button'
          aria-label='Back to Home'
        >
          {t('success.backToHome')}
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
    </div>
  )
}

export default Success
