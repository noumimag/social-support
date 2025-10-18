import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useController } from 'react-hook-form'
import ErrorMessage from './ErrorMessage'

const Dropdown = ({
  options = [],
  value = '',
  onChange = () => {},
  onBlur = () => {},
  placeholder = 'Select an option',
  searchable = false,
  multiSelect = false,
  disabled = false,
  error = false,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  showCheckmark = true,
  maxHeight = '200px',
  minWidth = '200px',
  position = 'bottom-left', // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
  closeOnSelect = true,
  renderOption = null,
  renderSelected = null,
  onSearch = null,
  searchPlaceholder = '',
  emptyMessage = '',
  loading = false,
  loadingText = '',
  // React Hook Form integration props
  name = '',
  rules = {},
  control = null,
  showValidation = false,
  // Additional props
  ...props
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  const optionRefs = useRef([])

  // React Hook Form integration
  const controller = useController({
    name: name || '',
    control: control || null,
    rules: rules || {},
    defaultValue: value || '',
  })

  // Use controller values if available, otherwise use props
  const fieldValue = controller && control ? controller.field.value : value
  const fieldOnChange = controller && control ? controller.field.onChange : onChange
  const fieldOnBlur = controller && control ? controller.field.onBlur : onBlur
  const fieldError = controller && control ? controller.fieldState.error : null
  const fieldTouched = controller && control ? controller.fieldState.isTouched : false

  // Determine if field should show error
  // Only show errors if field is touched or validation is explicitly shown
  const shouldShowError = fieldError && (fieldTouched || showValidation)
  const isFieldInvalid = shouldShowError

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchTerm) return options

    return options.filter(option => {
      const label =
        typeof option === 'string' ? option : option.label || option.name || option.value
      return label.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [options, searchTerm, searchable])

  // Handle option selection
  const handleOptionSelect = useCallback(
    option => {
      if (disabled) return

      if (multiSelect) {
        const currentValues = Array.isArray(fieldValue) ? fieldValue : []
        const optionValue = typeof option === 'string' ? option : option.value

        if (currentValues.includes(optionValue)) {
          fieldOnChange(currentValues.filter(v => v !== optionValue))
        } else {
          fieldOnChange([...currentValues, optionValue])
        }
      } else {
        const optionValue = typeof option === 'string' ? option : option.value
        fieldOnChange(optionValue)
        if (closeOnSelect !== false) {
          setIsOpen(false)
          setSearchTerm('')
          setFocusedIndex(-1)
        }
      }
    },
    [disabled, multiSelect, fieldValue, fieldOnChange, closeOnSelect],
  )

  // Keyboard navigation
  const handleKeyDown = useCallback(
    event => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          setSearchTerm('')
          setFocusedIndex(-1)
          break
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
          break
        case 'Enter':
          event.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleOptionSelect(filteredOptions[focusedIndex])
          }
          break
        case 'Tab':
          setIsOpen(false)
          setSearchTerm('')
          setFocusedIndex(-1)
          break
      }
    },
    [isOpen, focusedIndex, filteredOptions, handleOptionSelect],
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  // Toggle dropdown
  const toggleDropdown = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('')
      setFocusedIndex(-1)
    }
  }

  // Handle search
  const handleSearchChange = e => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    setFocusedIndex(-1)
    if (onSearch) {
      onSearch(newSearchTerm)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    setFocusedIndex(-1)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Get display value
  const getDisplayValue = () => {
    if (multiSelect) {
      if (!Array.isArray(fieldValue) || fieldValue.length === 0) return placeholder
      if (fieldValue.length === 1) {
        const option = options.find(
          opt => (typeof opt === 'string' ? opt : opt.value) === fieldValue[0],
        )
        return typeof option === 'string' ? option : option?.label || option?.name || fieldValue[0]
      }
      return `${fieldValue.length} selected`
    }

    if (!fieldValue) return placeholder
    const option = options.find(opt => (typeof opt === 'string' ? opt : opt.value) === fieldValue)
    return typeof option === 'string' ? option : option?.label || option?.name || fieldValue
  }

  // Check if option is selected
  const isSelected = option => {
    const optionValue = typeof option === 'string' ? option : option.value
    if (multiSelect) {
      return Array.isArray(fieldValue) && fieldValue.includes(optionValue)
    }
    return fieldValue === optionValue
  }

  // Get position classes
  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50'
    switch (position) {
      case 'top-left':
        return `${baseClasses} bottom-full left-0 mb-1`
      case 'top-right':
        return `${baseClasses} bottom-full right-0 mb-1`
      case 'bottom-right':
        return `${baseClasses} top-full right-0 mt-1`
      default: // bottom-left
        return `${baseClasses} top-half ltr:left-0 mt-1`
    }
  }

  // Render option
  const renderOptionContent = (option, index) => {
    if (renderOption) {
      return renderOption(option, { isSelected: isSelected(option), index })
    }

    const label = typeof option === 'string' ? option : option.label || option.name || option.value
    const isOptionSelected = isSelected(option)
    const isFocused = focusedIndex === index

    return (
      <div
        key={typeof option === 'string' ? option : option.value || index}
        ref={el => (optionRefs.current[index] = el)}
        className={`
          dropdown-option
          ${isFocused ? 'focused' : ''}
          ${isOptionSelected ? 'selected' : ''}
          ${optionClassName}
        `}
        onClick={() => handleOptionSelect(option)}
        role='option'
        aria-selected={isOptionSelected}
      >
        <span className='flex-1 truncate'>{label}</span>
        {showCheckmark && isOptionSelected && <Check className='dropdown-checkmark' />}
      </div>
    )
  }

  // Render selected value
  const renderSelectedContent = () => {
    if (renderSelected) {
      return renderSelected(value, { multiSelect, options })
    }
    return getDisplayValue()
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef} {...props}>
      {/* Trigger Button */}
      <button
        type='button'
        onClick={toggleDropdown}
        onBlur={fieldOnBlur}
        disabled={disabled}
        className={`
          dropdown-trigger
          ${error || isFieldInvalid ? 'error' : ''}
          ${disabled ? 'disabled' : ''}
          ${isOpen ? 'focus' : ''}
        `}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-label={placeholder}
        aria-invalid={isFieldInvalid}
        aria-describedby={shouldShowError ? `${name}-error` : undefined}
      >
        <div className='flex items-center justify-between'>
          <span
            className={`
            truncate flex-1
            ${!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}
          `}
          >
            {renderSelectedContent()}
          </span>
          <ChevronDown
            className={`
              dropdown-icon
              ${isOpen ? 'open' : ''}
            `}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            dropdown-menu ${getPositionClasses()}
            ${dropdownClassName}
          `}
          style={{ minWidth, maxHeight }}
          role='listbox'
          aria-label='Options'
        >
          {/* Search Input */}
          {searchable && (
            <div className='dropdown-search-container'>
              <div className='dropdown-search-wrapper'>
                <Search className='dropdown-search-icon' />
                <input
                  ref={searchInputRef}
                  type='text'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder || t('dropdown.searchPlaceholder', 'Search...')}
                  className='dropdown-search-input'
                />
                {searchTerm && (
                  <button type='button' onClick={clearSearch} className='dropdown-search-clear'>
                    <X className='w-4 h-4' />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className='dropdown-options dropdown-scroll'>
            {loading ? (
              <div className='dropdown-loading'>
                <div className='dropdown-loading-spinner'></div>
                {loadingText || t('dropdown.loading', 'Loading...')}
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className='dropdown-empty'>
                {emptyMessage || t('dropdown.noOptionsFound', 'No options found')}
              </div>
            ) : (
              filteredOptions.map((option, index) => renderOptionContent(option, index))
            )}
          </div>
        </div>
      )}

      {/* Error Message - Only show if showValidation is true */}
      {showValidation && (
        <ErrorMessage
          id={`${name}-error`}
          message={shouldShowError && fieldError ? fieldError.message : ''}
          isVisible={shouldShowError && !!fieldError}
        />
      )}
    </div>
  )
}

export default Dropdown
