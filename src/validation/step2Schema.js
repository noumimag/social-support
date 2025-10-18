import * as Yup from 'yup'

// Create a function that returns the schema with translated messages
export const createStep2Schema = t =>
  Yup.object({
    maritalStatus: Yup.string().required(t('form.validation.required')),
    dependents: Yup.number()
      .typeError(t('form.validation.required'))
      .min(0, t('form.validation.required'))
      .max(10, t('form.validation.maxLength', { count: 10 }))
      .required(t('form.validation.required')),
    employmentStatus: Yup.string().required(t('form.validation.required')),
    monthlyIncome: Yup.number()
      .typeError(t('form.validation.invalidNumber'))
      .min(0, t('form.validation.negativeIncome'))
      .max(1000000, t('form.validation.maxIncome'))
      .required(t('form.validation.incomeRequired')),
    housingStatus: Yup.string().required(t('form.validation.required')),
  })

// Keep the old export for backward compatibility
export const step2Schema = createStep2Schema
