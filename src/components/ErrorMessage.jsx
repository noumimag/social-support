import React from 'react'

const ErrorMessage = ({ id, message, isVisible = false, className = '' }) => {
  return (
    <div className={`error-message-container ${className}`}>
      <p
        id={id}
        role='alert'
        className={`error-message ${isVisible ? 'visible' : 'hidden'}`}
        aria-live='polite'
        aria-atomic='true'
      >
        {message || '\u00A0'} {/* Non-breaking space to maintain height */}
      </p>
    </div>
  )
}

export default ErrorMessage
