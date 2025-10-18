import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const ApplicationHeader = () => {
  const { t } = useTranslation()
  const { currentStep } = useSelector(state => state.form)

  const steps = [
    { number: 1, label: 'Personal Information' },
    { number: 2, label: 'Family & Financial Info' },
    { number: 3, label: 'Situation Details' },
  ]

  return (
    <div className='max-w-full sm:max-w-[80%]'>
      {/* Application Progress */}
      <div className='mb-3'>
        <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3'>
          <span className='font-semibold text-accent-600 dark:text-accent-400'>
            {t('form.navigation.step')} {currentStep} {t('form.navigation.of')} {steps.length}
          </span>
        </div>
        <div className='w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner'>
          <div
            className='h-full bg-gradient-to-r from-accent-200 to-accent-300 dark:from-accent-600 dark:to-accent-500 rounded-full transition-all duration-700 ease-out shadow-sm'
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationHeader
