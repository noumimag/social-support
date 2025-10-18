import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Custom hook for step form management
 * Encapsulates common form logic used across all step components
 *
 * @param {Object} config - Configuration object
 * @param {string} config.stepName - Name of the step (e.g., 'step1', 'step2', 'step3')
 * @param {Function} config.createSchema - Function to create validation schema
 * @param {Function} config.updateAction - Redux action to update step data
 * @param {Object} config.defaultValues - Default values for the form
 * @param {Object} config.formOptions - Additional form options
 * @returns {Object} Form utilities and state
 */
export const useStepForm = ({
  stepName,
  createSchema,
  updateAction,
  defaultValues = {},
  formOptions = {},
}) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form[stepName], shallowEqual)

  // State management
  const [showValidation, setShowValidation] = useState(false)
  const [isInitialValidation, setIsInitialValidation] = useState(true)

  // Hydration guard
  const hydratingRef = useRef(false)

  // Create schema that recreates when language changes
  const validationSchema = useMemo(() => createSchema(t), [t, createSchema])

  // Form configuration
  const formConfig = {
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: false,
    defaultValues: {
      ...formData,
      ...defaultValues,
    },
    ...formOptions,
  }

  const form = useForm(formConfig)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    trigger,
    reset,
    control,
  } = form

  // 1. Hydrate from Redux and validate
  useEffect(() => {
    const validateOnLoad = async () => {
      hydratingRef.current = true
      reset(formData)
      await trigger() // runs validation to enable buttons
      hydratingRef.current = false
      setIsInitialValidation(false)
    }
    validateOnLoad()
  }, [formData, reset, trigger])

  // 2. Watch user edits dispatch to Redux, but skip during hydration
  useEffect(() => {
    const sub = watch(values => {
      if (hydratingRef.current) return // <- breaks the loop without deep compare
      dispatch(updateAction(values))
    })
    return () => sub.unsubscribe()
  }, [watch, dispatch, updateAction])

  // 3. Re-trigger validation when language changes (schema updates)
  useEffect(() => {
    if (!isInitialValidation) {
      trigger() // Re-validate all fields with new translated messages
    }
  }, [validationSchema, trigger, isInitialValidation])

  // Validation helpers
  const shouldShowError = fieldName => {
    if (isInitialValidation) return false
    return errors[fieldName] && (touchedFields[fieldName] || showValidation)
  }

  const isFieldInvalid = fieldName => {
    if (isInitialValidation) return false
    return errors[fieldName] && (touchedFields[fieldName] || showValidation)
  }

  // Enhanced error message translation
  const translateErrorMessage = message => {
    if (message.startsWith('form.validation.')) {
      if (message.includes(':')) {
        const [key, count] = message.split(':')
        return t(key, { count: parseInt(count) })
      }
      return t(message)
    }
    return message
  }

  // Form submission handler
  const onSubmit = () => {
    setShowValidation(true)
    // Form validation is handled by React Hook Form
    // Data will be automatically saved to Redux via the watch subscription
  }

  // Return the imperative handle setup function
  const exposeFormRef = ref => {
    // This will be called by the component to set up the ref
    if (ref) {
      ref.getCurrentData = () => watch()
      ref.isValid = () => isValid
      ref.showValidation = () => setShowValidation(true)
    }
  }

  return {
    // Form utilities
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    reset,

    // Form state
    errors,
    isValid,
    touchedFields,

    // Validation helpers
    shouldShowError,
    isFieldInvalid,
    translateErrorMessage,

    // State management
    showValidation,
    setShowValidation,
    isInitialValidation,

    // Form handlers
    onSubmit,

    // Ref exposure
    exposeFormRef,

    // Translation
    t,
    i18n,

    // Form data
    formData,
  }
}

export default useStepForm
