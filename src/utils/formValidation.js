/**
 * Common validation utilities for form components
 */

/**
 * Common validation rules that can be reused across forms
 */
export const commonValidationRules = {
  required: message => ({
    required: message,
  }),

  minLength: (min, message) => ({
    minLength: {
      value: min,
      message,
    },
  }),

  maxLength: (max, message) => ({
    maxLength: {
      value: max,
      message,
    },
  }),

  pattern: (regex, message) => ({
    pattern: {
      value: regex,
      message,
    },
  }),

  email: message => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message,
    },
  }),

  name: message => ({
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message,
    },
  }),

  city: message => ({
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message,
    },
  }),

  phone: message => ({
    pattern: {
      value: /^[\d\s\-+()]+$/,
      message,
    },
  }),
}

/**
 * Common validation patterns for different field types
 */
export const fieldValidationPatterns = {
  // Name fields (first name, last name)
  name: {
    required: 'form.validation.required',
    minLength: 2,
    pattern: 'step1.validation.namePattern',
  },

  // Email field
  email: {
    required: 'form.validation.required',
    pattern: 'step1.validation.emailPattern',
    maxLength: 254,
  },

  // Phone field
  phone: {
    required: 'form.validation.required',
    pattern: 'step1.validation.phonePattern',
  },

  // City field
  city: {
    required: 'form.validation.required',
    minLength: 2,
    pattern: 'step1.validation.cityPattern',
  },

  // Address field
  address: {
    required: 'form.validation.required',
    minLength: 10,
    maxLength: 200,
  },

  // Textarea fields (Step 3)
  textarea: {
    required: 'form.validation.required',
    minLength: 50,
    maxLength: 1000,
  },
}

/**
 * Generate validation rules for a field based on its type
 * @param {string} fieldType - Type of field (name, email, phone, etc.)
 * @param {Function} t - Translation function
 * @returns {Object} Validation rules object
 */
export const getFieldValidationRules = (fieldType, t) => {
  const pattern = fieldValidationPatterns[fieldType]
  if (!pattern) return {}

  const rules = {}

  if (pattern.required) {
    rules.required = t(pattern.required)
  }

  if (pattern.minLength) {
    rules.minLength = {
      value: pattern.minLength,
      message: t('form.validation.minLength', { count: pattern.minLength }),
    }
  }

  if (pattern.maxLength) {
    rules.maxLength = {
      value: pattern.maxLength,
      message: t('form.validation.maxLength', { count: pattern.maxLength }),
    }
  }

  if (pattern.pattern) {
    const patternRules = commonValidationRules[pattern.pattern]
    if (patternRules) {
      Object.assign(rules, patternRules(t(pattern.pattern)))
    }
  }

  return rules
}

/**
 * Common date validation for date of birth
 * @param {Function} t - Translation function
 * @returns {Object} Date validation rules
 */
export const getDateOfBirthValidation = t => ({
  required: t('form.validation.required'),
  validate: value => {
    if (!value) return t('form.validation.required')

    const today = new Date()
    const birthDate = new Date(value)

    if (birthDate > today) return t('step1.validation.futureDate')

    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 18) return t('step1.validation.ageRequirement')
    if (age > 120) return t('step1.validation.invalidDate')

    return true
  },
})

/**
 * Common validation for dropdown fields
 * @param {Function} t - Translation function
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Dropdown validation rules
 */
export const getDropdownValidation = (t, fieldName) => ({
  required: t(`step2.validation.${fieldName}Required`),
})

/**
 * Common validation for number fields
 * @param {Function} t - Translation function
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @param {number} options.step - Step value
 * @returns {Object} Number validation rules
 */
export const getNumberValidation = (t, options = {}) => {
  const rules = {
    required: t('form.validation.required'),
  }

  if (options.min !== undefined) {
    rules.min = {
      value: options.min,
      message: t('form.validation.minValue', { min: options.min }),
    }
  }

  if (options.max !== undefined) {
    rules.max = {
      value: options.max,
      message: t('form.validation.maxValue', { max: options.max }),
    }
  }

  return rules
}

/**
 * Generate CSS classes for form field validation states
 * @param {string} baseClass - Base CSS class
 * @param {boolean} isInvalid - Whether field is invalid
 * @param {string} invalidClass - CSS class for invalid state
 * @returns {string} Combined CSS classes
 */
export const getFieldClasses = (
  baseClass,
  isInvalid,
  invalidClass = 'invalid-field border-red-500 focus:ring-red-500',
) => {
  return isInvalid ? `${baseClass} ${invalidClass}` : baseClass
}

/**
 * Generate aria attributes for form fields
 * @param {string} fieldName - Name of the field
 * @param {Object} errors - Form errors object
 * @returns {Object} Aria attributes object
 */
export const getAriaAttributes = (fieldName, errors) => {
  const hasError = errors[fieldName]
  return {
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': hasError ? `${fieldName}-error` : undefined,
    'aria-required': 'true',
  }
}

export default {
  commonValidationRules,
  fieldValidationPatterns,
  getFieldValidationRules,
  getDateOfBirthValidation,
  getDropdownValidation,
  getNumberValidation,
  getFieldClasses,
  getAriaAttributes,
}
