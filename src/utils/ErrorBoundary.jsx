import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center'>
          <div className='max-w-md mx-auto text-center p-6'>
            <div className='mb-4'>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Something went wrong
              </h1>
              <p className='text-gray-600 dark:text-gray-300'>
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className='
                px-4 py-2 
                bg-blue-600 hover:bg-blue-700 
                text-white font-medium 
                rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                transition-colors duration-200
              '
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
