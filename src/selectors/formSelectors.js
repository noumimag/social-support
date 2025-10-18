import { createStep1Schema } from '../validation/step1Schema'
import { createStep2Schema } from '../validation/step2Schema'
import { createStep3Schema } from '../validation/step3Schema'

// Create a simple translation function for validation
const t = (key, options = {}) => {
  // Fallback to English messages for validation
  const messages = {
    'form.validation.required': 'This field is required',
    'form.validation.minLength': `Must be at least ${options.count || 0} characters`,
    'form.validation.maxLength': `Must be no more than ${options.count || 0} characters`,
    'form.validation.email': 'Invalid email address',
    'form.validation.invalidNumber': 'Please enter a valid number',
    'form.validation.negativeIncome': 'Income cannot be negative',
    'form.validation.maxIncome': 'Please enter a reasonable income amount',
    'form.validation.incomeRequired': 'Monthly income is required',
    'step1.validation.idPattern': 'National ID must contain only numbers',
    'step1.validation.phonePattern': 'Phone number must contain only numbers',
  }
  return messages[key] || key
}

export const isStep1Complete = s => createStep1Schema(t).isValidSync(s.form.step1)
export const isStep2Complete = s => createStep2Schema(t).isValidSync(s.form.step2)
export const isStep3Complete = s => createStep3Schema(t).isValidSync(s.form.step3)
