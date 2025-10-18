import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/css/styles.css'
import '@/assets/css/dropdown.css'
import App from './App.jsx'
import './i18n'
import '@fontsource/plus-jakarta-sans'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource-variable/noto-kufi-arabic'

// Set up RTL direction and Arabic font based on language
const setupLanguage = () => {
  const savedLanguage = localStorage.getItem('i18nextLng') || 'en'
  const isRTL = savedLanguage === 'ar'

  // Set HTML direction
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = savedLanguage
}

// Set up language on initial load
setupLanguage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
