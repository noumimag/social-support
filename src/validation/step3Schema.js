import * as Yup from 'yup'

// Create a function that returns the schema with translated messages
export const createStep3Schema = t =>
  Yup.object({
    currentFinancialSituation: Yup.object({
      userInput: Yup.string()
        .required(t('form.validation.required'))
        .min(30, t('form.validation.minLength', { count: 30 }))
        .max(1000, t('form.validation.maxLength', { count: 1000 })),
    }),
    employmentCircumstances: Yup.object({
      userInput: Yup.string()
        .required(t('form.validation.required'))
        .min(30, t('form.validation.minLength', { count: 30 }))
        .max(1000, t('form.validation.maxLength', { count: 1000 })),
    }),
    reasonForApplying: Yup.object({
      userInput: Yup.string()
        .required(t('form.validation.required'))
        .min(30, t('form.validation.minLength', { count: 30 }))
        .max(1000, t('form.validation.maxLength', { count: 1000 })),
    }),
  })

// Keep the old export for backward compatibility
export const step3Schema = createStep3Schema
