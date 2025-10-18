import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setCurrentStep,
  loadFormData,
  updateStep1,
  updateStep2,
  updateStep3,
} from '../store/formSlice'
import { loadFormData as loadFromStorage, saveFormData } from '../services/storage'
import { isStep1Complete, isStep2Complete, isStep3Complete } from '../selectors/formSelectors'
import VerticalStepSidebar from './VerticalStepSidebar'
import ApplicationHeader from './ApplicationHeader'
import StepNavigation from './StepNavigation'
import AutoResume from './AutoResume'
import Step1Personal from '../pages/Step1Personal'
import Step2Family from '../pages/Step2Family'
import Step3Situation from '../pages/Step3Situation'

const FormWizard = () => {
  const dispatch = useDispatch()
  const { currentStep, step1, step2, step3 } = useSelector(state => state.form)
  const [isSubmitting] = useState(false)
  const [hasAutoResumed, setHasAutoResumed] = useState(false)

  // Refs to access current form data
  const step1Ref = useRef()
  const step2Ref = useRef()
  const step3Ref = useRef()

  // Function to trigger validation display
  const handleShowValidation = () => {
    if (currentStep === 1 && step1Ref.current?.showValidation) {
      step1Ref.current.showValidation()
    } else if (currentStep === 2 && step2Ref.current?.showValidation) {
      step2Ref.current.showValidation()
    } else if (currentStep === 3 && step3Ref.current?.showValidation) {
      step3Ref.current.showValidation()
    }
  }

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromStorage()
    if (savedData) {
      dispatch(loadFormData(savedData))
    }
  }, [dispatch])

  // Handle auto-resume navigation
  const handleNavigateToStep = step => {
    if (!hasAutoResumed) {
      dispatch(setCurrentStep(step))
      setHasAutoResumed(true)
    }
  }

  // Handle step navigation
  const handleNext = () => {
    if (currentStep < 4) {
      // Get current form data from the active step component
      let currentStepData = {}

      if (currentStep === 1 && step1Ref.current) {
        currentStepData = step1Ref.current.getCurrentData()
        dispatch(updateStep1(currentStepData))
      } else if (currentStep === 2 && step2Ref.current) {
        currentStepData = step2Ref.current.getCurrentData()
        dispatch(updateStep2(currentStepData))
      } else if (currentStep === 3 && step3Ref.current) {
        currentStepData = step3Ref.current.getCurrentData()
        dispatch(updateStep3(currentStepData))
      }

      // Save updated form data to localStorage
      const updatedFormData = { step1, step2, step3 }
      saveFormData(updatedFormData)

      dispatch(setCurrentStep(currentStep + 1))

      // Focus management: Move focus to the new step content
      setTimeout(() => {
        const newStepContent = document.querySelector('[role="region"][aria-label*="Step"]')
        if (newStepContent) {
          const firstInput = newStepContent.querySelector('input, select, textarea')
          if (firstInput) {
            firstInput.focus()
          } else {
            newStepContent.focus()
          }
        }
      }, 100)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1))

      // Focus management: Move focus to the previous step content
      setTimeout(() => {
        const stepContent = document.querySelector('[role="region"][aria-label*="Step"]')
        if (stepContent) {
          const firstInput = stepContent.querySelector('input, select, textarea')
          if (firstInput) {
            firstInput.focus()
          } else {
            stepContent.focus()
          }
        }
      }, 100)
    }
  }

  // Check if current step is valid using selectors
  const isStepValid = () => {
    const state = { form: { step1, step2, step3 } }
    switch (currentStep) {
      case 1:
        return isStep1Complete(state)
      case 2:
        return isStep2Complete(state)
      case 3:
        return isStep3Complete(state)
      case 4:
        // For summary, check all previous steps are complete
        return isStep1Complete(state) && isStep2Complete(state) && isStep3Complete(state)
      default:
        return false
    }
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Personal ref={step1Ref} />
      case 2:
        return <Step2Family ref={step2Ref} />
      case 3:
        return <Step3Situation ref={step3Ref} />
      default:
        return <Step1Personal ref={step1Ref} />
    }
  }

  return (
    <div className='w-full max-w-7xl mx-auto'>
      {/* Skip to main content link for screen readers */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent-200 text-gray-900 px-4 py-2 rounded-lg z-50'
      >
        Skip to main content
      </a>

      {/* Live region for screen reader announcements */}
      <div id='form-status' className='sr-only' aria-live='polite' aria-atomic='true'>
        Step {currentStep} of 3
      </div>

      {/* Auto-resume to correct step */}
      <AutoResume onNavigateToStep={handleNavigateToStep} />

      {/* Main Layout */}
      <div className='glass-card'>
        {/* Two Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10'>
          {/* Sidebar - Steps */}
          <div className='lg:col-span-1 rtl:order-2 lg:order-1 order-2'>
            <div className='lg:sticky lg:top-6'>
              <ApplicationHeader />
              <VerticalStepSidebar />
            </div>
          </div>

          {/* Content - Form */}
          <div className='lg:col-span-3 rtl:order-1 lg:order-2 order-1'>
            <div className='space-y-4 sm:space-y-6'>
              {/* Form Content */}
              <div id='main-content' role='region' aria-label={`Step ${currentStep} form`}>
                {renderCurrentStep()}
              </div>

              {/* Form Footer */}
              {currentStep <= 3 && (
                <div className='pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50'>
                  <StepNavigation
                    currentStep={currentStep}
                    isStepValid={isStepValid()}
                    onNext={handleNext}
                    onBack={handleBack}
                    isSubmitting={isSubmitting}
                    onShowValidation={handleShowValidation}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormWizard
