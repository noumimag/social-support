import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFormSubmission } from '../hooks/useFormSubmission'

const StepNavigation = ({
  currentStep,
  isStepValid,
  onNext,
  onBack,
  isSubmitting = false,
  onShowValidation,
}) => {
  const { t, i18n } = useTranslation()
  const { isSubmitting: isSubmittingApp, handleSubmit } = useFormSubmission()
  const handleBack = () => {
    if (currentStep > 1 && onBack) {
      onBack()
    }
  }

  const handleSubmitApplication = async () => {
    if (!isStepValid) {
      if (onShowValidation) {
        onShowValidation()
      }
      return
    }

    await handleSubmit()
  }

  const handleNext = () => {
    if (currentStep === 3) {
      // For Step 3, submit the application
      handleSubmitApplication()
    } else if (isStepValid && onNext) {
      onNext()
    } else if (onShowValidation) {
      onShowValidation()
    }
  }

  const handleHover = () => {
    if (!isStepValid && onShowValidation) {
      onShowValidation()
    }
  }

  const canGoBack = currentStep > 1
  const canGoNext = isStepValid && currentStep < 4
  const isLastStep = currentStep === 4
  const isStep3 = currentStep === 3
  const isActuallySubmitting = isSubmitting || isSubmittingApp

  return (
    <div className='flex rtl:flex-row-reverse flex-row justify-between items-center gap-4 pt-4 sm:pt-6'>
      {/* Back Button - Only show if not on Step 1 */}
      {canGoBack && (
        <button
          onClick={handleBack}
          className='flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full transition-all duration-300 min-h-[48px] transform group text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
          aria-label='Go to previous step'
        >
          {i18n.language === 'ar' ? (
            <ArrowRight
              className='w-5 h-5 sm:w-6 sm:h-6 rtl:ml-2 mr-2 transition-transform duration-300 group-hover:translate-x-1 drop-shadow-sm'
              aria-hidden='true'
            />
          ) : (
            <ArrowLeft
              className='w-5 h-5 sm:w-6 sm:h-6 rtl:ml-2 mr-2 transition-transform duration-300 group-hover:-translate-x-1 drop-shadow-sm'
              aria-hidden='true'
            />
          )}
          {t('common.back')}
        </button>
      )}

      {/* Spacer div when back button is hidden to maintain layout */}
      {!canGoBack && <div></div>}

      {/* Next/Submit Button */}
      <div className='relative group'>
        <button
          onClick={handleNext}
          onMouseEnter={handleHover}
          disabled={!canGoNext || isActuallySubmitting}
          className={`
             flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full transition-all duration-300 min-h-[48px] transform group relative overflow-hidden
             ${
               canGoNext && !isActuallySubmitting
                 ? 'bg-gradient-to-r from-accent-300 to-accent-400 hover:from-accent-400 hover:to-accent-500 text-white shadow-2xl hover:shadow-accent-200/25 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent-200/50 focus:ring-offset-2 shimmer-button'
                 : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
             }
           `}
          aria-label={
            isStep3 ? 'Submit application' : isLastStep ? 'Submit form' : 'Go to next step'
          }
        >
          {isActuallySubmitting ? (
            <span className='flex items-center'>
              <svg
                className='animate-spin rtl:-mr-1 rtl:ml-2 -ml-1 mr-2 h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              {t('common.loading')}
            </span>
          ) : isStep3 ? (
            <>
              {t('common.submit')}
              {i18n.language === 'ar' ? (
                <ArrowLeft
                  className='w-5 h-5 sm:w-6 sm:h-6 rtl:mr-2 ml-2 transition-transform duration-300 group-hover:-translate-x-1 drop-shadow-sm'
                  aria-hidden='true'
                />
              ) : (
                <ArrowRight
                  className='w-5 h-5 sm:w-6 sm:h-6 rtl:mr-2 ml-2 transition-transform duration-300 group-hover:translate-x-1 drop-shadow-sm'
                  aria-hidden='true'
                />
              )}
            </>
          ) : isLastStep ? (
            <>
              {t('common.submit')}
              {i18n.language === 'ar' ? (
                <ArrowLeft
                  className='w-5 h-5 sm:w-6 sm:h-6 rtl:mr-2 ml-2 transition-transform duration-300 group-hover:-translate-x-1 drop-shadow-sm'
                  aria-hidden='true'
                />
              ) : (
                <ArrowRight
                  className='w-5 h-5 sm:w-6 sm:h-6 rtl:mr-2 ml-2 transition-transform duration-300 group-hover:translate-x-1 drop-shadow-sm'
                  aria-hidden='true'
                />
              )}
            </>
          ) : (
            <>
              {t('common.next')}
              {i18n.language === 'ar' ? (
                <ArrowLeft
                  className='w-5 h-5 sm:w-6 sm:h-6 rtl:mr-2 ml-2 transition-transform duration-300 group-hover:-translate-x-1 drop-shadow-sm'
                  aria-hidden='true'
                />
              ) : (
                <ArrowRight
                  className='w-5 h-5 sm:w-6 sm:h-6 rtl:mr-2 ml-2 transition-transform duration-300 group-hover:translate-x-1 drop-shadow-sm'
                  aria-hidden='true'
                />
              )}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default StepNavigation
