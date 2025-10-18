import { useEffect, forwardRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateStep3 } from '../store/formSlice'
import { createStep3Schema } from '../validation/step3Schema'
import useStepForm from '../hooks/useStepForm'
import { getFieldClasses, getAriaAttributes } from '../utils/formValidation'
import { generateText, getErrorMessage, isConfigured } from '../services/openaiService'
import AISuggestionModal from '../components/AISuggestionModal'
import { Sparkles, Loader2 } from 'lucide-react'

const Step3Situation = forwardRef((props, ref) => {
  const dispatch = useDispatch()

  // Use the custom hook for all form logic
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    errors,
    isFieldInvalid,
    translateErrorMessage,
    onSubmit,
    exposeFormRef,
    t,
    i18n,
    formData,
  } = useStepForm({
    stepName: 'step3',
    createSchema: createStep3Schema,
    updateAction: updateStep3,
    formOptions: {
      mode: 'onChange',
      reValidateMode: 'onChange',
    },
  })

  // Expose form ref
  exposeFormRef(ref)

  // AI assistance state
  const [aiModal, setAiModal] = useState({
    isOpen: false,
    fieldName: '',
    isLoading: false,
    suggestion: '',
    error: null,
  })
  const [abortController, setAbortController] = useState(null)
  const [isRequestInProgress, setIsRequestInProgress] = useState(false)

  // AI validation errors for empty fields
  const [aiValidationErrors, setAiValidationErrors] = useState({
    currentFinancialSituation: false,
    employmentCircumstances: false,
    reasonForApplying: false,
  })

  // Clear AI validation error when user starts typing
  const clearAIValidationError = fieldName => {
    setAiValidationErrors(prev => ({
      ...prev,
      [fieldName]: false,
    }))
  }

  // AI assistance functions
  const getFieldPrompt = (fieldName, currentValue) => {
    const isRTL = i18n.language === 'ar'
    const prompts = {
      currentFinancialSituation: isRTL
        ? `ساعدني في كتابة وصف واضح لوضعي المالي الحالي لطلب دعم اجتماعي. أحتاج لشرح تحدياتي واحتياجاتي المالية. السياق الحالي: "${currentValue}"`
        : `Help me write a clear description of my current financial situation for a social support application. I need to explain my financial challenges and needs. Current context: "${currentValue}"`,
      employmentCircumstances: isRTL
        ? `ساعدني في وصف ظروف عملي لطلب دعم اجتماعي. أحتاج لشرح وضعي الوظيفي، أي فقدان وظيفة، تقليل ساعات، أو تحديات توظيف. السياق الحالي: "${currentValue}"`
        : `Help me describe my employment circumstances for a social support application. I need to explain my work situation, any job loss, reduced hours, or employment challenges. Current context: "${currentValue}"`,
      reasonForApplying: isRTL
        ? `ساعدني في شرح سبب تقديمي لطلب الدعم الاجتماعي. أحتاج أن أكون محدداً حول نوع الدعم الذي أحتاجه وكيف سيكون له تأثير. السياق الحالي: "${currentValue}"`
        : `Help me explain why I'm applying for social support. I need to be specific about what type of support I need and how it would make a difference. Current context: "${currentValue}"`,
    }
    return (
      prompts[fieldName] ||
      (isRTL
        ? `ساعدني في كتابة رد لـ: ${fieldName}. السياق الحالي: "${currentValue}"`
        : `Help me write a response for: ${fieldName}. Current context: "${currentValue}"`)
    )
  }

  const handleAIHelp = async fieldName => {
    // Prevent multiple simultaneous requests
    if (isRequestInProgress) {
      return
    }

    if (!isConfigured()) {
      alert('AI assistance is not configured. Please set up your OpenAI API key.')
      return
    }

    const currentValue = formData[fieldName]?.userInput || ''

    // Check if field is empty and show validation error
    if (!currentValue.trim()) {
      setAiValidationErrors(prev => ({
        ...prev,
        [fieldName]: true,
      }))
      return
    }

    // Clear any existing validation error for this field
    setAiValidationErrors(prev => ({
      ...prev,
      [fieldName]: false,
    }))

    const prompt = getFieldPrompt(fieldName, currentValue)

    // Check if we already have a suggestion for this exact prompt
    if (formData[fieldName]?.lastPrompt === prompt && formData[fieldName]?.aiSuggestion) {
      setAiModal({
        isOpen: true,
        fieldName,
        isLoading: false,
        suggestion: formData[fieldName].aiSuggestion,
        error: null,
      })
      return
    }

    // Cancel any existing request
    if (abortController) {
      abortController.abort()
    }

    // Create new abort controller
    const controller = new AbortController()
    setAbortController(controller)
    setIsRequestInProgress(true)

    setAiModal({
      isOpen: true,
      fieldName,
      isLoading: true,
      suggestion: '',
      error: null,
    })

    try {
      const suggestion = await generateText(prompt, {
        signal: controller.signal,
        language: i18n.language,
      })

      // Update Redux with the suggestion and prompt
      dispatch(
        updateStep3({
          ...formData,
          [fieldName]: {
            ...formData[fieldName],
            aiSuggestion: suggestion,
            lastPrompt: prompt,
          },
        }),
      )

      setAiModal({
        isOpen: true,
        fieldName,
        isLoading: false,
        suggestion,
        error: null,
      })
    } catch (error) {
      console.error('AI request failed for field:', fieldName, error)
      const errorMessage = getErrorMessage(error)
      setAiModal({
        isOpen: true,
        fieldName,
        isLoading: false,
        suggestion: '',
        error: errorMessage,
      })
    } finally {
      setAbortController(null)
      setIsRequestInProgress(false)
    }
  }

  const handleAcceptSuggestion = suggestion => {
    const fieldName = aiModal.fieldName
    const currentValues = watch()

    // Update the form with the accepted suggestion
    const updatedValues = {
      ...currentValues,
      [fieldName]: {
        ...currentValues[fieldName],
        userInput: suggestion,
      },
    }

    dispatch(updateStep3(updatedValues))
    setAiModal({ isOpen: false, fieldName: '', isLoading: false, suggestion: '', error: null })
  }

  const handleCloseModal = () => {
    // Cancel any ongoing request
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }

    setIsRequestInProgress(false)
    setAiModal({ isOpen: false, fieldName: '', isLoading: false, suggestion: '', error: null })
  }

  // Cleanup effect to cancel any ongoing requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [abortController])

  // Debug form state (following React Hook Form docs pattern)
  const watchedFields = formData

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h2 className='text-lg rtl:text-lg sm:text-2xl font-bold text-gray-900 dark:text-white'>
          {t('step3.title')}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 sm:space-y-8'
        role='form'
        aria-label='Situation Information Form'
      >
        {/* Current Financial Situation Section */}
        <div className='space-y-4'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <label
                htmlFor='currentFinancialSituation'
                className={`input-label rtl:text-right text-left ${isFieldInvalid('currentFinancialSituation.userInput') ? 'invalid-field text-red-600 dark:text-red-400' : ''}`}
              >
                {t('step3.fields.situation.label')} <span className='text-red-500'>*</span>
              </label>
              <button
                type='button'
                onClick={() => handleAIHelp('currentFinancialSituation')}
                className='inline-flex items-center rtl:space-x-reverse space-x-1 px-3 py-1.5 text-xs text-white bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isRequestInProgress}
              >
                {isRequestInProgress ? (
                  <>
                    <Loader2 className='w-3 h-3 animate-spin' />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className='w-3 h-3' />
                    <span>{t('step3.aiHelp.button')}</span>
                  </>
                )}
              </button>
            </div>
            <div
              className={`${isFieldInvalid('currentFinancialSituation.userInput') ? 'invalid-field ring-1 ring-red-500 rounded-lg p-2' : ''}`}
            >
              <textarea
                {...register('currentFinancialSituation.userInput', {
                  onChange: () => {
                    // Clear AI validation error when user starts typing
                    clearAIValidationError('currentFinancialSituation')
                    // Live validation
                    trigger('currentFinancialSituation.userInput')
                  },
                })}
                id='currentFinancialSituation'
                rows={5}
                maxLength={1000}
                className={getFieldClasses(
                  'input-field resize-none rtl:text-right text-left',
                  isFieldInvalid('currentFinancialSituation.userInput'),
                )}
                placeholder={t('step3.fields.situation.placeholder')}
                {...getAriaAttributes('currentFinancialSituation.userInput', errors)}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className='mt-2 flex justify-between items-start'>
              <div className='flex-1'>
                {errors.currentFinancialSituation?.userInput && (
                  <p
                    id='currentFinancialSituation-error'
                    role='alert'
                    className='text-sm text-red-600 dark:text-red-400'
                  >
                    {translateErrorMessage(errors.currentFinancialSituation.userInput.message)}
                  </p>
                )}
                {aiValidationErrors.currentFinancialSituation && (
                  <p role='alert' className='text-sm text-red-600 dark:text-red-400'>
                    {t('step3.validation.aiFieldEmpty')}
                  </p>
                )}
              </div>
              <div className='rtl:ml-4 ml-4 flex-shrink-0'>
                {!errors.currentFinancialSituation?.userInput && (
                  <p className='text-xs text-gray-500 dark:text-gray-400 rtl:text-left text-right'>
                    {t('step3.validation.characterCount', {
                      current: watchedFields.currentFinancialSituation?.userInput?.length || 0,
                      max: 1000,
                    })}
                  </p>
                )}
                {errors.currentFinancialSituation?.userInput && (
                  <p className='text-xs text-red-500 dark:text-red-400 rtl:text-left text-right'>
                    {t('step3.validation.characterCount', {
                      current: watchedFields.currentFinancialSituation?.userInput?.length || 0,
                      max: 1000,
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Employment Circumstances Section */}
        <div className='space-y-4'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <label
                htmlFor='employmentCircumstances'
                className={`input-label rtl:text-right text-left ${isFieldInvalid('employmentCircumstances.userInput') ? 'invalid-field text-red-600 dark:text-red-400' : ''}`}
              >
                {t('step3.fields.employment.label')} <span className='text-red-500'>*</span>
              </label>
              <button
                type='button'
                onClick={() => handleAIHelp('employmentCircumstances')}
                className='inline-flex items-center rtl:space-x-reverse space-x-1 px-3 py-1.5 text-xs text-white bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isRequestInProgress}
              >
                {isRequestInProgress ? (
                  <>
                    <Loader2 className='w-3 h-3 animate-spin' />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className='w-3 h-3' />
                    <span>{t('step3.aiHelp.button')}</span>
                  </>
                )}
              </button>
            </div>
            <div
              className={`${isFieldInvalid('employmentCircumstances.userInput') ? 'invalid-field ring-1 ring-red-500 rounded-lg p-2' : ''}`}
            >
              <textarea
                {...register('employmentCircumstances.userInput', {
                  onChange: () => {
                    // Clear AI validation error when user starts typing
                    clearAIValidationError('employmentCircumstances')
                    // Live validation
                    trigger('employmentCircumstances.userInput')
                  },
                })}
                id='employmentCircumstances'
                rows={5}
                maxLength={1000}
                className={getFieldClasses(
                  'input-field resize-none rtl:text-right text-left',
                  isFieldInvalid('employmentCircumstances.userInput'),
                )}
                placeholder={t('step3.fields.employment.placeholder')}
                {...getAriaAttributes('employmentCircumstances.userInput', errors)}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className='mt-2 flex justify-between items-start'>
              <div className='flex-1'>
                {errors.employmentCircumstances?.userInput && (
                  <p
                    id='employmentCircumstances-error'
                    role='alert'
                    className='text-sm text-red-600 dark:text-red-400'
                  >
                    {translateErrorMessage(errors.employmentCircumstances.userInput.message)}
                  </p>
                )}
                {aiValidationErrors.employmentCircumstances && (
                  <p role='alert' className='text-sm text-red-600 dark:text-red-400'>
                    {t('step3.validation.aiFieldEmpty')}
                  </p>
                )}
              </div>
              <div className='rtl:ml-4 ml-4 flex-shrink-0'>
                {!errors.employmentCircumstances?.userInput && (
                  <p className='text-xs text-gray-500 dark:text-gray-400 rtl:text-left text-right'>
                    {t('step3.validation.characterCount', {
                      current: watchedFields.employmentCircumstances?.userInput?.length || 0,
                      max: 1000,
                    })}
                  </p>
                )}
                {errors.employmentCircumstances?.userInput && (
                  <p className='text-xs text-red-500 dark:text-red-400 rtl:text-left text-right'>
                    {t('step3.validation.characterCount', {
                      current: watchedFields.employmentCircumstances?.userInput?.length || 0,
                      max: 1000,
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reason for Applying Section */}
        <div className='space-y-4'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <label
                htmlFor='reasonForApplying'
                className={`input-label rtl:text-right text-left ${isFieldInvalid('reasonForApplying.userInput') ? 'invalid-field text-red-600 dark:text-red-400' : ''}`}
              >
                {t('step3.fields.reason.label')} <span className='text-red-500'>*</span>
              </label>
              <button
                type='button'
                onClick={() => handleAIHelp('reasonForApplying')}
                className='inline-flex items-center rtl:space-x-reverse space-x-1 px-3 py-1.5 text-xs text-white bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isRequestInProgress}
              >
                {isRequestInProgress ? (
                  <>
                    <Loader2 className='w-3 h-3 animate-spin' />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className='w-3 h-3' />
                    <span>{t('step3.aiHelp.button')}</span>
                  </>
                )}
              </button>
            </div>
            <div
              className={`${isFieldInvalid('reasonForApplying.userInput') ? 'invalid-field ring-1 ring-red-500 rounded-lg p-2' : ''}`}
            >
              <textarea
                {...register('reasonForApplying.userInput', {
                  onChange: () => {
                    // Clear AI validation error when user starts typing
                    clearAIValidationError('reasonForApplying')
                    // Live validation
                    trigger('reasonForApplying.userInput')
                  },
                })}
                id='reasonForApplying'
                rows={5}
                maxLength={1000}
                className={getFieldClasses(
                  'input-field resize-none rtl:text-right text-left',
                  isFieldInvalid('reasonForApplying.userInput'),
                )}
                placeholder={t('step3.fields.reason.placeholder')}
                {...getAriaAttributes('reasonForApplying.userInput', errors)}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className='mt-2 flex justify-between items-start'>
              <div className='flex-1'>
                {errors.reasonForApplying?.userInput && (
                  <p
                    id='reasonForApplying-error'
                    role='alert'
                    className='text-sm text-red-600 dark:text-red-400'
                  >
                    {translateErrorMessage(errors.reasonForApplying.userInput.message)}
                  </p>
                )}
                {aiValidationErrors.reasonForApplying && (
                  <p role='alert' className='text-sm text-red-600 dark:text-red-400'>
                    {t('step3.validation.aiFieldEmpty')}
                  </p>
                )}
              </div>
              <div className='rtl:ml-4 ml-4 flex-shrink-0'>
                {!errors.reasonForApplying?.userInput && (
                  <p className='text-xs text-gray-500 dark:text-gray-400 rtl:text-left text-right'>
                    {t('step3.validation.characterCount', {
                      current: watchedFields.reasonForApplying?.userInput?.length || 0,
                      max: 1000,
                    })}
                  </p>
                )}
                {errors.reasonForApplying?.userInput && (
                  <p className='text-xs text-red-500 dark:text-red-400 rtl:text-left text-right'>
                    {t('step3.validation.characterCount', {
                      current: watchedFields.reasonForApplying?.userInput?.length || 0,
                      max: 1000,
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* AI Suggestion Modal */}
      <AISuggestionModal
        isOpen={aiModal.isOpen}
        onClose={handleCloseModal}
        onAccept={handleAcceptSuggestion}
        onEdit={() => {}} // Handled internally by the modal
        fieldName={aiModal.fieldName}
        currentValue={formData[aiModal.fieldName]?.userInput || ''}
        isLoading={aiModal.isLoading}
        suggestion={aiModal.suggestion}
        error={aiModal.error}
      />
    </div>
  )
})

export default Step3Situation
