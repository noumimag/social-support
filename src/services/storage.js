// Storage service for form data persistence
const KEY = 'ssa.form.v1'

export const loadFormData = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const saveFormData = state => {
  try {
    const payload = {
      ...state,
      meta: {
        ...state.meta,
        lastSaved: Date.now(),
        version: 1,
      },
    }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch (error) {
    console.error('Failed to save form data:', error)
  }
}

export const clearFormData = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Ignore errors when clearing localStorage
  }
}

// Check if user can access a specific step based on completed steps
export const canAccessStep = (step, formState) => {
  if (!formState) return step === 1

  switch (step) {
    case 1:
      return true
    case 2:
      return formState.step1?.isValid || false
    case 3:
      return formState.step1?.isValid && formState.step2?.isValid
    case 4:
      return formState.step1?.isValid && formState.step2?.isValid && formState.step3?.isValid
    default:
      return false
  }
}
