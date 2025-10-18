import { useState, useEffect, useRef } from 'react'
import { X, Loader2, Check, SquarePen, Trash2, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const AISuggestionModal = ({
  isOpen,
  onClose,
  onAccept,
  isLoading = false,
  suggestion = '',
  error = null,
}) => {
  const { t } = useTranslation()
  const [editedSuggestion, setEditedSuggestion] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const modalRef = useRef(null)
  const textareaRef = useRef(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEditedSuggestion(suggestion)
      setIsEditing(false)
    } else {
      setEditedSuggestion('')
      setIsEditing(false)
    }
  }, [isOpen, suggestion])

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = e => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus()
            e.preventDefault()
          }
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    return () => modal.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  const handleAccept = () => {
    const finalSuggestion = isEditing ? editedSuggestion : suggestion
    onAccept(finalSuggestion)
    onClose()
  }

  const handleEdit = () => {
    setIsEditing(true)
    // Focus the textarea after state update
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const handleDiscard = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 overflow-y-auto'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      {/* Backdrop */}
      <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />

      {/* Modal container */}
      <div className='flex min-h-full items-center justify-center p-2 sm:p-4 text-center'>
        <div
          ref={modalRef}
          className='relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto'
          tabIndex={-1}
        >
          {/* Header */}
          <div className='bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-2'>
                <Sparkles className='w-5 h-5 text-accent-500' />
                <h3 className='text-lg font-medium text-gray-900 dark:text-white' id='modal-title'>
                  {t('step3.aiHelp.modal.title')}
                </h3>
              </div>
              <button
                onClick={onClose}
                className='rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                aria-label='Close modal'
              >
                <X className='w-6 h-6 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300' />
              </button>
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
              {t('step3.aiHelp.modal.description')}
            </p>

            {/* Content */}
            <div className='space-y-4'>
              {isLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='flex items-center space-x-3'>
                    <Loader2 className='w-6 h-6 animate-spin text-accent-500' />
                    <span className='text-gray-600 dark:text-gray-400'>{t('common.loading')}</span>
                  </div>
                </div>
              ) : error ? (
                <div className='flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                  <XCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
                  <div>
                    <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                      {t('common.error')}
                    </p>
                    <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
                  </div>
                </div>
              ) : suggestion ? (
                <div className='space-y-4'>
                  {isEditing ? (
                    <div>
                      <label
                        htmlFor='edited-suggestion'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                      >
                        {t('step3.aiHelp.modal.editSuggestion')}
                      </label>
                      <textarea
                        ref={textareaRef}
                        id='edited-suggestion'
                        value={editedSuggestion}
                        onChange={e => setEditedSuggestion(e.target.value)}
                        rows={6}
                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none'
                        placeholder={t('step3.aiHelp.modal.placeholder')}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        {t('step3.aiHelp.modal.suggestion')}:
                      </label>
                      <div className='p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg'>
                        <p className='text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap'>
                          {suggestion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Footer */}
          <div className='px-4 py-3 sm:flex sm:justify-center sm:px-6'>
            <div className='flex flex-col sm:flex-row sm:space-x-3 sm:space-x-reverse space-y-2 sm:space-y-0 w-full sm:w-auto sm:justify-center'>
              {!isLoading && !error && suggestion && (
                <>
                  <button
                    type='button'
                    onClick={handleAccept}
                    className='w-full sm:w-auto ltr:mr-3 inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 dark:focus:ring-offset-gray-800'
                  >
                    <Check className='w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2' />
                    {t('step3.aiHelp.modal.useSuggestion')}
                  </button>

                  {!isEditing ? (
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800'
                    >
                      <SquarePen className='w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2' />
                      {t('common.edit')}
                    </button>
                  ) : (
                    <button
                      type='button'
                      onClick={() => setIsEditing(false)}
                      className='w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800'
                    >
                      {t('common.cancel')}
                    </button>
                  )}
                </>
              )}

              <button
                type='button'
                onClick={handleDiscard}
                className='inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800'
              >
                <Trash2 className='w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2' />
                {t('common.discard')}
              </button>
            </div>
          </div>

          {/* AI Disclaimer */}
          <div className='px-4 py-2'>
            <p className='text-xs text-gray-600 dark:text-gray-400 text-center'>
              {t('step3.aiHelp.modal.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISuggestionModal
