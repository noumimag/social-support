import { useSelector } from 'react-redux'
import { Check, User, Users, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const VerticalStepSidebar = () => {
  const { t } = useTranslation()
  const { currentStep } = useSelector(state => state.form)

  const steps = [
    {
      number: 1,
      label: t('form.steps.personal'),
      icon: User,
    },
    {
      number: 2,
      label: t('form.steps.family'),
      icon: Users,
    },
    {
      number: 3,
      label: t('form.steps.situation'),
      icon: FileText,
    },
  ]

  return (
    <div className='w-full' role='navigation' aria-label='Application steps'>
      {/* Step Header */}
      <div className='mb-4 sm:mb-6'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {currentStep === 1 && t('step1.subtitle')}
          {currentStep === 2 && t('step2.subtitle')}
          {currentStep === 3 && t('step3.subtitle')}
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className='relative' role='list' aria-label='Application progress'>
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number
          const IconComponent = step.icon

          return (
            <div
              key={step.number}
              className='relative flex items-start mb-8 sm:mb-10 last:mb-0'
              role='listitem'
            >
              {/* Timeline Line */}
              {index < steps.length - 1 && (
                <div
                  className='absolute top-8 w-0.5 h-12 sm:h-16 bg-gray-300 dark:bg-gray-700 rtl:right-4 left-4'
                  aria-hidden='true'
                ></div>
              )}

              {/* Step Circle */}
              <div className='relative z-10 flex-shrink-0'>
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-white border-green-500 text-accent-200'
                        : isCurrent
                          ? 'bg-accent-200 border-accent-200 text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    }
                  `}
                  aria-label={`Step ${step.number}: ${step.label} - ${isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Upcoming'}`}
                >
                  {isCompleted ? (
                    <Check className='w-4 h-4' aria-hidden='true' />
                  ) : (
                    <IconComponent className='w-4 h-4' aria-hidden='true' />
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className='rtl:mr-4 ml-4 flex-1 self-center'>
                <div
                  className={`
                    text-sm font-semibold transition-colors duration-300
                    ${
                      isCompleted
                        ? 'text-gray-500'
                        : isCurrent
                          ? 'text-accent-600 dark:text-accent-400'
                          : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VerticalStepSidebar
