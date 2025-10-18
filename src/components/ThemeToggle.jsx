import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className='
        p-2 rounded-lg 
        bg-gray-100 dark:bg-gray-800 
        text-gray-900 dark:text-white
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        transition-colors duration-200
        border border-gray-200 dark:border-gray-700
      '
    >
      {isDark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
    </button>
  )
}

export default ThemeToggle
