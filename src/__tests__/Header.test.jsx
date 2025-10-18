import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ThemeProvider } from '../context/ThemeProvider'
import Header from '../components/Header'

// Mock the child components
jest.mock('../components/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button data-testid='theme-toggle'>Theme Toggle</button>
  }
})

jest.mock('../components/LanguageToggle', () => {
  return function MockLanguageToggle() {
    return <button data-testid='language-toggle'>Language Toggle</button>
  }
})

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>{children}</ThemeProvider>
    </I18nextProvider>
  </BrowserRouter>
)

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the header with logo and title', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    )

    // Check if header is rendered with proper role
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()

    // Check if the logo link is present
    const logoLink = screen.getByRole('link')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')

    // Check if the title is rendered
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render theme and language toggle components', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    )

    // Check if toggle components are rendered
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    )

    // Check header accessibility
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()

    // Check logo link accessibility
    const logoLink = screen.getByRole('link')
    expect(logoLink).toHaveAttribute('aria-label')
  })

  it('should have proper styling classes', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    )

    const header = screen.getByRole('banner')

    // Check if header has proper CSS classes
    expect(header).toHaveClass('bg-gray-200', 'dark:bg-gray-800')
    expect(header).toHaveClass('sticky', 'top-0')
  })
})
