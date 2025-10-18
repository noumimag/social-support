import React from 'react'
import { render, screen } from '@testing-library/react'
import ErrorMessage from '../components/ErrorMessage'

describe('ErrorMessage', () => {
  it('should render with visible error message', () => {
    render(<ErrorMessage id='test-error' message='This field is required' isVisible={true} />)

    const errorElement = screen.getByRole('alert')
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveTextContent('This field is required')
    expect(errorElement).toHaveClass('visible')
    expect(errorElement).not.toHaveClass('hidden')
  })

  it('should render with hidden error message (reserves space)', () => {
    render(<ErrorMessage id='test-error' message='' isVisible={false} />)

    const errorElement = screen.getByRole('alert')
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveClass('hidden')
    expect(errorElement).not.toHaveClass('visible')
    // Should be present to maintain layout space
    expect(errorElement).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<ErrorMessage id='test-error' message='Error message' isVisible={true} />)

    const errorElement = screen.getByRole('alert')
    expect(errorElement).toHaveAttribute('id', 'test-error')
    expect(errorElement).toHaveAttribute('aria-live', 'polite')
    expect(errorElement).toHaveAttribute('aria-atomic', 'true')
  })

  it('should apply custom className', () => {
    render(
      <ErrorMessage
        id='test-error'
        message='Error message'
        isVisible={true}
        className='custom-class'
      />,
    )

    const container = screen.getByRole('alert').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('should toggle visibility classes correctly', () => {
    const { rerender } = render(
      <ErrorMessage id='test-error' message='Error message' isVisible={true} />,
    )

    let errorElement = screen.getByRole('alert')
    expect(errorElement).toHaveClass('visible')
    expect(errorElement).not.toHaveClass('hidden')

    // Toggle to hidden
    rerender(<ErrorMessage id='test-error' message='' isVisible={false} />)

    errorElement = screen.getByRole('alert')
    expect(errorElement).toHaveClass('hidden')
    expect(errorElement).not.toHaveClass('visible')
  })
})
