import { useCallback } from 'react'

/**
 * Custom hook for keyboard navigation support
 * Provides common keyboard shortcuts and navigation patterns
 */
export const useKeyboardNavigation = () => {
  // Handle Escape key to close modals or go back
  const handleEscape = useCallback(callback => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle Enter key for form submission
  const handleEnter = useCallback(callback => {
    const handleKeyDown = event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle Tab navigation within a container
  const handleTabNavigation = useCallback((containerRef, options = {}) => {
    const { loop = true, focusFirst = false } = options

    const setupTabNavigation = () => {
      const container = containerRef.current
      if (!container) return

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (focusFirst && firstElement) {
        firstElement.focus()
      }

      const handleKeyDown = event => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            // Shift + Tab (backward)
            if (document.activeElement === firstElement && loop) {
              event.preventDefault()
              lastElement?.focus()
            }
          } else {
            // Tab (forward)
            if (document.activeElement === lastElement && loop) {
              event.preventDefault()
              firstElement?.focus()
            }
          }
        }
      }

      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }

    return setupTabNavigation
  }, [])

  // Handle arrow key navigation for radio groups
  const handleArrowNavigation = useCallback((containerRef, options = {}) => {
    const { orientation = 'horizontal' } = options

    const setupArrowNavigation = () => {
      const container = containerRef.current
      if (!container) return

      const radioButtons = Array.from(container.querySelectorAll('input[type="radio"]'))

      const handleKeyDown = event => {
        const { key } = event
        const currentIndex = radioButtons.indexOf(document.activeElement)

        if (currentIndex === -1) return

        let nextIndex = currentIndex

        if (orientation === 'horizontal') {
          if (key === 'ArrowLeft' || key === 'ArrowUp') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : radioButtons.length - 1
          } else if (key === 'ArrowRight' || key === 'ArrowDown') {
            nextIndex = currentIndex < radioButtons.length - 1 ? currentIndex + 1 : 0
          }
        } else {
          if (key === 'ArrowUp') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : radioButtons.length - 1
          } else if (key === 'ArrowDown') {
            nextIndex = currentIndex < radioButtons.length - 1 ? currentIndex + 1 : 0
          }
        }

        if (nextIndex !== currentIndex) {
          event.preventDefault()
          radioButtons[nextIndex]?.focus()
          radioButtons[nextIndex]?.click()
        }
      }

      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }

    return setupArrowNavigation
  }, [])

  return {
    handleEscape,
    handleEnter,
    handleTabNavigation,
    handleArrowNavigation,
  }
}

export default useKeyboardNavigation
