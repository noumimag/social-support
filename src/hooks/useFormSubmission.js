import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setFormComplete, setFormSubmitted, resetForm } from '../store/formSlice'
import { clearFormData, saveFormData } from '../services/storage'
import { submitApplication } from '../services/applicationService'

/**
 * Custom hook for handling form submission logic
 * Consolidates submission logic used across multiple components
 */
export const useFormSubmission = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { step1, step2, step3 } = useSelector(state => state.form)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Save final form data before submission
      const finalFormData = { step1, step2, step3 }
      saveFormData(finalFormData)

      // Submit application using the service
      await submitApplication(finalFormData)

      // Mark form as complete and submitted
      dispatch(setFormComplete(true))
      dispatch(setFormSubmitted(true))

      // Navigate to success page first
      navigate('/success')

      // Clear form data and reset Redux state after navigation
      // This will be handled by the Success page component
    } catch (error) {
      console.error('Submission error:', error)
      // Handle error - show more specific error message to user
      const errorMessage = error.message || 'Failed to submit application. Please try again.'
      alert(`Submission failed: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearDraft = onBackToHome => {
    if (
      window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')
    ) {
      dispatch(resetForm())
      clearFormData()
      if (onBackToHome) {
        onBackToHome()
      }
    }
  }

  return {
    isSubmitting,
    handleSubmit,
    handleClearDraft,
  }
}
