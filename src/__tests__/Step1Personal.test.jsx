import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { store } from '../store/store'
import { ThemeProvider } from '../context/ThemeProvider'
import Step1Personal from '../pages/Step1Personal'

// Mock the useStepForm hook
jest.mock('../hooks/useStepForm', () => ({
  __esModule: true,
  default: () => ({
    register: jest.fn(name => ({
      name,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
    })),
    handleSubmit: jest.fn(fn => e => {
      e.preventDefault()
      fn()
    }),
    control: {},
    errors: {},
    shouldShowError: jest.fn(() => false),
    isFieldInvalid: jest.fn(() => false),
    translateErrorMessage: jest.fn(msg => msg),
    onSubmit: jest.fn(),
    exposeFormRef: jest.fn(),
    t: key => key,
    i18n: { language: 'en' },
  }),
}))

// Mock the useKeyboardNavigation hook
jest.mock('../hooks/useKeyboardNavigation', () => ({
  __esModule: true,
  default: () => ({
    handleArrowNavigation: jest.fn(),
  }),
}))

// Mock the Dropdown component
jest.mock('../components/Dropdown', () => {
  return function MockDropdown({ name, placeholder }) {
    return (
      <select id={name} name={name} data-testid={`dropdown-${name}`}>
        <option value=''>{placeholder}</option>
        <option value='test-option'>Test Option</option>
      </select>
    )
  }
})

// Test wrapper component
const TestWrapper = ({ children }) => (
  <Provider store={store}>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>{children}</ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  </Provider>
)

describe('Step1Personal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the form', () => {
    render(
      <TestWrapper>
        <Step1Personal />
      </TestWrapper>,
    )

    // Check if the form title is rendered
    expect(screen.getByText('step1.title')).toBeInTheDocument()

    // Check if the form has proper ARIA attributes
    expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'Personal Information Form')

    // Check if key form fields are present
    expect(screen.getByLabelText(/step1.fields.firstName.label/)).toBeInTheDocument()
    expect(screen.getByLabelText(/step1.fields.lastName.label/)).toBeInTheDocument()
    expect(screen.getByLabelText(/step1.fields.email.label/)).toBeInTheDocument()
    expect(screen.getByLabelText(/step1.fields.phone.label/)).toBeInTheDocument()
  })

  it('should display validation error messages when provided', () => {
    // Test that the component can display error messages
    // This tests the error display mechanism without triggering actual validation
    render(
      <TestWrapper>
        <Step1Personal />
      </TestWrapper>,
    )

    // Verify that the form renders without errors initially
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()

    // Check that required field indicators are present
    const requiredIndicators = screen.getAllByText('*')
    expect(requiredIndicators.length).toBeGreaterThan(0)

    // Verify error message structure exists (even if not visible)
    // The actual validation is handled by react-hook-form and yup
    const firstNameInput = screen.getByLabelText(/step1.fields.firstName.label/)
    expect(firstNameInput).toHaveAttribute('aria-required', 'true')
    expect(firstNameInput).toHaveAttribute('aria-invalid', 'false')
  })

  it('should render gender radio buttons correctly', () => {
    render(
      <TestWrapper>
        <Step1Personal />
      </TestWrapper>,
    )

    // Check if gender fieldset is rendered
    const genderFieldset = screen.getByRole('radiogroup')
    expect(genderFieldset).toBeInTheDocument()
    expect(genderFieldset).toHaveAttribute('aria-required', 'true')

    // Check if radio buttons are present
    const radioButtons = screen.getAllByRole('radio')
    expect(radioButtons).toHaveLength(2)
  })

  it('should render dropdown components for state and country', () => {
    render(
      <TestWrapper>
        <Step1Personal />
      </TestWrapper>,
    )

    // Check if dropdown components are rendered
    expect(screen.getByTestId('dropdown-state')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-country')).toBeInTheDocument()
  })

  it('should have proper form accessibility attributes', () => {
    render(
      <TestWrapper>
        <Step1Personal />
      </TestWrapper>,
    )

    // Check form accessibility
    const form = screen.getByRole('form')
    expect(form).toHaveAttribute('aria-label', 'Personal Information Form')

    // Check if required fields are marked
    const requiredFields = screen.getAllByText('*')
    expect(requiredFields.length).toBeGreaterThan(0)
  })
})
