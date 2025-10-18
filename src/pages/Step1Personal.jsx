import { forwardRef, useRef } from 'react'
import { updateStep1 } from '../store/formSlice'
import { createStep1Schema } from '../validation/step1Schema'
import useKeyboardNavigation from '../hooks/useKeyboardNavigation'
import useStepForm from '../hooks/useStepForm'
import {
  getFieldValidationRules,
  getDateOfBirthValidation,
  getFieldClasses,
  getAriaAttributes,
} from '../utils/formValidation'
import Dropdown from '../components/Dropdown'
import {
  genderOptions,
  stateOptions,
  countryOptions,
  getCurrentLanguage,
  getLocalizedLabel,
} from '../constants/formOptions'

const Step1Personal = forwardRef((props, ref) => {
  const { handleArrowNavigation } = useKeyboardNavigation()
  const genderGroupRef = useRef()

  // Use the custom hook for all form logic
  const {
    register,
    handleSubmit,
    control,
    errors,
    shouldShowError,
    isFieldInvalid,
    translateErrorMessage,
    onSubmit,
    exposeFormRef,
    t,
    i18n,
  } = useStepForm({
    stepName: 'step1',
    createSchema: createStep1Schema,
    updateAction: updateStep1,
    defaultValues: {
      country: 'uae',
    },
  })

  // Expose form ref
  exposeFormRef(ref)

  // Keyboard navigation
  handleArrowNavigation(genderGroupRef, { orientation: 'horizontal' })

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h2 className='text-lg rtl:text-lg sm:text-2xl font-bold text-gray-900 dark:text-white'>
          {t('step1.title')}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 sm:space-y-8'
        role='form'
        aria-label='Personal Information Form'
      >
        {/* Basic Information Section */}
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='firstName' className='input-label'>
                {t('step1.fields.firstName.label')} <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('firstName', getFieldValidationRules('name', t))}
                type='text'
                id='firstName'
                className={getFieldClasses('input-field', isFieldInvalid('firstName'))}
                placeholder={t('step1.fields.firstName.placeholder')}
                {...getAriaAttributes('firstName', errors)}
                autoComplete='given-name'
              />
              {shouldShowError('firstName') && errors.firstName && (
                <p
                  id='firstName-error'
                  role='alert'
                  className='mt-2 text-sm text-red-600 dark:text-red-400'
                >
                  {translateErrorMessage(errors.firstName.message)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='lastName' className='input-label'>
                {t('step1.fields.lastName.label')} <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('lastName', getFieldValidationRules('name', t))}
                type='text'
                id='lastName'
                className={getFieldClasses('input-field', isFieldInvalid('lastName'))}
                placeholder={t('step1.fields.lastName.placeholder')}
                {...getAriaAttributes('lastName', errors)}
                autoComplete='family-name'
              />
              {shouldShowError('lastName') && errors.lastName && (
                <p
                  id='lastName-error'
                  role='alert'
                  className='mt-2 text-sm text-red-600 dark:text-red-400'
                >
                  {translateErrorMessage(errors.lastName.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Identity Information Section */}
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='nationalId' className='input-label'>
                {t('step1.fields.nationalId.label')} <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('nationalId')}
                type='text'
                id='nationalId'
                inputMode='numeric'
                className={getFieldClasses('input-field', isFieldInvalid('nationalId'))}
                placeholder={t('step1.fields.nationalId.placeholder')}
                {...getAriaAttributes('nationalId', errors)}
                autoComplete='off'
              />
              {shouldShowError('nationalId') && errors.nationalId && (
                <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                  {translateErrorMessage(errors.nationalId.message)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='dateOfBirth' className='input-label'>
                {t('step1.fields.dateOfBirth.label')} <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('dateOfBirth', getDateOfBirthValidation(t))}
                type='date'
                id='dateOfBirth'
                className={getFieldClasses('input-field', isFieldInvalid('dateOfBirth'))}
                placeholder={t('step1.fields.dateOfBirth.placeholder')}
                {...getAriaAttributes('dateOfBirth', errors)}
                autoComplete='bday'
              />
              {shouldShowError('dateOfBirth') && errors.dateOfBirth && (
                <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                  {translateErrorMessage(errors.dateOfBirth.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className='space-y-4'>
          <div>
            <fieldset>
              <legend className='input-label'>
                {t('step1.fields.gender.label')} <span className='text-red-500'>*</span>
              </legend>
              <div
                ref={genderGroupRef}
                className={`flex rtl:space-x-reverse space-x-6 ${isFieldInvalid('gender') ? 'invalid-field ring-1 ring-red-500 rounded-lg p-2' : ''}`}
                role='radiogroup'
                aria-required='true'
              >
                {genderOptions.map(option => (
                  <label key={option.id} className='flex items-center cursor-pointer group'>
                    <input
                      {...register('gender', {
                        required: t('form.validation.required'),
                      })}
                      type='radio'
                      value={option.id}
                      className='h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 dark:border-gray-600'
                      aria-invalid={errors.gender ? 'true' : 'false'}
                      aria-describedby={errors.gender ? 'gender-error' : undefined}
                    />
                    <span className='rtl:mr-2 ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'>
                      {getLocalizedLabel(option, getCurrentLanguage(i18n))}
                    </span>
                  </label>
                ))}
              </div>
              {shouldShowError('gender') && errors.gender && (
                <p
                  id='gender-error'
                  role='alert'
                  className='mt-2 text-sm text-red-600 dark:text-red-400'
                >
                  {translateErrorMessage(errors.gender.message)}
                </p>
              )}
            </fieldset>
          </div>
        </div>

        {/* Location Information Section */}
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label htmlFor='city' className='input-label'>
                {t('step1.fields.city.label')} <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('city', getFieldValidationRules('city', t))}
                type='text'
                id='city'
                className={getFieldClasses('input-field', isFieldInvalid('city'))}
                placeholder={t('step1.fields.city.placeholder')}
                {...getAriaAttributes('city', errors)}
                autoComplete='address-level2'
              />
              {shouldShowError('city') && errors.city && (
                <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                  {translateErrorMessage(errors.city.message)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='state' className='input-label'>
                {t('step1.fields.state.label')} <span className='text-red-500'>*</span>
              </label>
              <Dropdown
                name='state'
                control={control}
                rules={{
                  required: t('form.validation.required'),
                }}
                options={stateOptions.map(option => ({
                  value: option.id,
                  label: getLocalizedLabel(option, getCurrentLanguage(i18n)),
                }))}
                placeholder={t('step1.fields.state.placeholder')}
                searchable={true}
                minWidth='200px'
                position='bottom-left'
                aria-required='true'
                showValidation={false} // This will be handled by the hook
              />
            </div>

            <div>
              <label htmlFor='country' className='input-label'>
                {t('step1.fields.country.label')} <span className='text-red-500'>*</span>
              </label>
              <Dropdown
                name='country'
                control={control}
                rules={{
                  required: t('form.validation.required'),
                }}
                options={countryOptions.map(option => ({
                  value: option.id,
                  label: getLocalizedLabel(option, getCurrentLanguage(i18n)),
                }))}
                placeholder={t('step1.fields.country.placeholder')}
                searchable={true}
                minWidth='200px'
                position='bottom-left'
                aria-required='true'
                showValidation={false} // This will be handled by the hook
              />
            </div>
          </div>
          <div>
            <label htmlFor='address' className='input-label'>
              {t('step1.fields.address.label')} <span className='text-red-500'>*</span>
            </label>
            <textarea
              {...register('address', getFieldValidationRules('address', t))}
              id='address'
              rows={2}
              className={getFieldClasses('input-field resize-none', isFieldInvalid('address'))}
              placeholder={t('step1.fields.address.placeholder')}
              {...getAriaAttributes('address', errors)}
              autoComplete='street-address'
            />
            {shouldShowError('address') && errors.address && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                {translateErrorMessage(errors.address.message)}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='phone' className='input-label'>
                {t('step1.fields.phone.label')} <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('phone', getFieldValidationRules('phone', t))}
                type='tel'
                id='phone'
                inputMode='numeric'
                className={getFieldClasses('input-field', isFieldInvalid('phone'))}
                placeholder={t('step1.fields.phone.placeholder')}
                {...getAriaAttributes('phone', errors)}
                autoComplete='tel'
              />
              {shouldShowError('phone') && errors.phone && (
                <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                  {translateErrorMessage(errors.phone.message)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='email' className='input-label'>
                {t('step1.fields.email.label')} <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('email', getFieldValidationRules('email', t))}
                type='email'
                id='email'
                className={getFieldClasses('input-field', isFieldInvalid('email'))}
                placeholder={t('step1.fields.email.placeholder')}
                {...getAriaAttributes('email', errors)}
                autoComplete='email'
              />
              {shouldShowError('email') && errors.email && (
                <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                  {translateErrorMessage(errors.email.message)}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
})

export default Step1Personal
