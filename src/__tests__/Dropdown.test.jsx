import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import Dropdown from '../components/Dropdown'

// Test wrapper with form context
const TestWrapper = ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>

const TestForm = ({ onSubmit, children }) => {
  const { control } = useForm()

  return <form onSubmit={onSubmit}>{React.cloneElement(children, { control })}</form>
}

describe('Dropdown', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  it('should render dropdown with options', () => {
    render(
      <TestWrapper>
        <TestForm>
          <Dropdown name='test-dropdown' options={mockOptions} placeholder='Select an option' />
        </TestForm>
      </TestWrapper>,
    )

    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('should show error message when validation fails', () => {
    const TestFormWithError = () => {
      const { control } = useForm({
        defaultValues: { 'test-dropdown': '' },
        mode: 'onChange',
      })

      return (
        <form>
          <Dropdown
            name='test-dropdown'
            control={control}
            options={mockOptions}
            rules={{ required: 'This field is required' }}
            showValidation={true}
          />
        </form>
      )
    }

    render(
      <TestWrapper>
        <TestFormWithError />
      </TestWrapper>,
    )

    // The error message container should be present
    const errorContainer = screen.getByRole('alert')
    expect(errorContainer).toBeInTheDocument()
  })

  it('should handle dropdown opening and closing', () => {
    render(
      <TestWrapper>
        <TestForm>
          <Dropdown name='test-dropdown' options={mockOptions} placeholder='Select an option' />
        </TestForm>
      </TestWrapper>,
    )

    const dropdownButton = screen.getByRole('button')
    fireEvent.click(dropdownButton)

    // Options should be visible
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <TestForm>
          <Dropdown
            name='test-dropdown'
            options={mockOptions}
            placeholder='Select an option'
            aria-required='true'
          />
        </TestForm>
      </TestWrapper>,
    )

    const dropdownButton = screen.getByRole('button')
    expect(dropdownButton).toHaveAttribute('aria-haspopup', 'listbox')
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should support search functionality when searchable', () => {
    render(
      <TestWrapper>
        <TestForm>
          <Dropdown
            name='test-dropdown'
            options={mockOptions}
            placeholder='Select an option'
            searchable={true}
          />
        </TestForm>
      </TestWrapper>,
    )

    const dropdownButton = screen.getByRole('button')
    fireEvent.click(dropdownButton)

    // Search input should be present
    const searchInput = screen.getByPlaceholderText(/search/i)
    expect(searchInput).toBeInTheDocument()
  })
})
