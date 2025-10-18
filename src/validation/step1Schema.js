import * as Yup from 'yup'

// Create a function that returns the schema with translated messages
export const createStep1Schema = t =>
  Yup.object({
    firstName: Yup.string().required(t('form.validation.required')),
    lastName: Yup.string().required(t('form.validation.required')),
    nationalId: Yup.string()
      .required(t('form.validation.required'))
      .matches(/^[0-9]+$/, t('step1.validation.idPattern'))
      .min(5, t('form.validation.minLength', { count: 5 }))
      .max(20, t('form.validation.maxLength', { count: 20 })),
    dateOfBirth: Yup.string().required(t('form.validation.required')),
    gender: Yup.string().required(t('form.validation.required')),
    address: Yup.string().required(t('form.validation.required')),
    city: Yup.string().required(t('form.validation.required')),
    state: Yup.string().required(t('form.validation.required')),
    country: Yup.string().required(t('form.validation.required')),
    phone: Yup.string()
      .required(t('form.validation.required'))
      .matches(/^[0-9]+$/, t('step1.validation.phonePattern'))
      .min(7, t('form.validation.minLength', { count: 7 }))
      .max(15, t('form.validation.maxLength', { count: 15 })),
    email: Yup.string().email(t('form.validation.email')).required(t('form.validation.required')),
  })

// Keep the old export for backward compatibility
export const step1Schema = createStep1Schema
