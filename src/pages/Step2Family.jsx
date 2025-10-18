import { forwardRef } from 'react'
import { updateStep2 } from '../store/formSlice'
import { createStep2Schema } from '../validation/step2Schema'
import useStepForm from '../hooks/useStepForm'
import {
  getDropdownValidation,
  getNumberValidation,
  getFieldClasses,
  getAriaAttributes,
} from '../utils/formValidation'
import Dropdown from '../components/Dropdown'
import {
  maritalStatusOptions,
  employmentStatusOptions,
  housingStatusOptions,
  getCurrentLanguage,
  getLocalizedLabel,
} from '../constants/formOptions'

const Step2Family = forwardRef((props, ref) => {
  // Use the custom hook for all form logic
  const {
    register,
    handleSubmit,
    control,
    trigger,
    errors,
    shouldShowError,
    isFieldInvalid,
    translateErrorMessage,
    onSubmit,
    exposeFormRef,
    t,
    i18n,
  } = useStepForm({
    stepName: 'step2',
    createSchema: createStep2Schema,
    updateAction: updateStep2,
    defaultValues: {
      dependents: '', // Ensure empty string if undefined
    },
  })

  // Expose form ref
  exposeFormRef(ref)

  // Create dependents options
  const dependentsOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i.toString(),
    label:
      i === 0
        ? t('step2.fields.dependents.options.0')
        : i === 1
          ? t('step2.fields.dependents.options.1')
          : t('step2.fields.dependents.options.multiple', { count: i }),
  }))

  // Create employment status options
  const employmentStatusDropdownOptions = employmentStatusOptions.map(option => ({
    value: option.id,
    label: getLocalizedLabel(option, getCurrentLanguage(i18n)),
  }))

  // Create housing status options
  const housingStatusDropdownOptions = housingStatusOptions.map(option => ({
    value: option.id,
    label: getLocalizedLabel(option, getCurrentLanguage(i18n)),
  }))

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h2 className='text-lg rtl:text-lg sm:text-2xl font-bold text-gray-900 dark:text-white'>
          {t('step2.title')}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 sm:space-y-8'
        role='form'
        aria-label='Family Information Form'
      >
        {/* Marital Status Section */}
        <div className='space-y-4'>
          <div>
            <fieldset>
              <legend className='input-label'>
                {t('step2.fields.maritalStatus.label')} <span className='text-red-500'>*</span>
              </legend>
              <div
                className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isFieldInvalid('maritalStatus') ? 'invalid-field ring-1 ring-red-500 rounded-lg p-2' : ''}`}
              >
                {maritalStatusOptions.map(option => (
                  <label key={option.id} className='flex items-center cursor-pointer group'>
                    <input
                      {...register('maritalStatus', getDropdownValidation(t, 'maritalStatus'))}
                      type='radio'
                      value={option.id}
                      className={`h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 dark:border-gray-600 ${isFieldInvalid('maritalStatus') ? 'invalid-field' : ''}`}
                      {...getAriaAttributes('maritalStatus', errors)}
                    />
                    <span className='rtl:mr-2 ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'>
                      {getLocalizedLabel(option, getCurrentLanguage(i18n))}
                    </span>
                  </label>
                ))}
              </div>
              {shouldShowError('maritalStatus') && errors.maritalStatus && (
                <p
                  id='maritalStatus-error'
                  role='alert'
                  className='mt-2 text-sm text-red-600 dark:text-red-400'
                >
                  {translateErrorMessage(errors.maritalStatus.message)}
                </p>
              )}
            </fieldset>
          </div>
        </div>

        {/* Dependents Section */}
        <div className='space-y-4'>
          <div>
            <label htmlFor='dependents' className='input-label'>
              {t('step2.fields.dependents.label')} <span className='text-red-500'>*</span>
            </label>
            <Dropdown
              name='dependents'
              control={control}
              rules={{
                required: t('step2.validation.dependentsRequired'),
                validate: value => {
                  if (value === '' || value === null || isNaN(Number(value))) {
                    return t('step2.validation.dependentsRequired')
                  }
                  return true
                },
              }}
              options={dependentsOptions}
              placeholder={t('step2.fields.dependents.placeholder')}
              searchable={false}
              minWidth='200px'
              position='bottom-left'
              aria-required='true'
              showValidation={false} // This will be handled by the hook
            />
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              {t('step2.fields.dependents.helpText')}
            </p>
          </div>
        </div>

        {/* Employment Status Section */}
        <div className='space-y-4'>
          <div>
            <label htmlFor='employmentStatus' className='input-label'>
              {t('step2.fields.employmentStatus.label')} <span className='text-red-500'>*</span>
            </label>
            <Dropdown
              name='employmentStatus'
              control={control}
              rules={getDropdownValidation(t, 'employmentStatus')}
              options={employmentStatusDropdownOptions}
              placeholder={t('step2.fields.employmentStatus.placeholder')}
              searchable={true}
              minWidth='200px'
              position='bottom-left'
              aria-required='true'
              showValidation={false} // This will be handled by the hook
            />
          </div>
        </div>

        {/* Monthly Income and Housing Status Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Monthly Income */}
          <div className='space-y-4'>
            <label htmlFor='monthlyIncome' className='input-label'>
              {t('step2.fields.monthlyIncome.label')} <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 rtl:right-0 rtl:pr-3 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
                  {t('step2.fields.monthlyIncome.currency')}
                </span>
              </div>
              <input
                {...register('monthlyIncome', getNumberValidation(t, { min: 0, max: 1000000 }))}
                type='number'
                id='monthlyIncome'
                min='0'
                max='1000000'
                step='0.01'
                className={getFieldClasses(
                  'input-field rtl:!pr-12 !pl-12',
                  isFieldInvalid('monthlyIncome'),
                )}
                placeholder={t('step2.fields.monthlyIncome.placeholder')}
                {...getAriaAttributes('monthlyIncome', errors)}
                onBlur={e => {
                  // Trigger validation on blur
                  trigger('monthlyIncome')
                  // Call the original onBlur from register
                  register('monthlyIncome').onBlur(e)
                }}
              />
            </div>
            {shouldShowError('monthlyIncome') && errors.monthlyIncome && (
              <p
                id='monthlyIncome-error'
                role='alert'
                className='mt-2 text-sm text-red-600 dark:text-red-400'
              >
                {translateErrorMessage(errors.monthlyIncome.message)}
              </p>
            )}
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {t('step2.fields.monthlyIncome.helpText')}
            </p>
          </div>

          {/* Housing Status */}
          <div className='space-y-4'>
            <label htmlFor='housingStatus' className='input-label'>
              {t('step2.fields.housingStatus.label')} <span className='text-red-500'>*</span>
            </label>
            <Dropdown
              name='housingStatus'
              control={control}
              rules={getDropdownValidation(t, 'housingStatus')}
              options={housingStatusDropdownOptions}
              placeholder={t('step2.fields.housingStatus.placeholder')}
              searchable={true}
              minWidth='200px'
              position='bottom-left'
              aria-required='true'
              showValidation={false} // This will be handled by the hook
            />
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {t('step2.fields.housingStatus.helpText')}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
})

export default Step2Family
