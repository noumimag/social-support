import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider'
import { store } from './store/store'
import ErrorBoundary from './utils/ErrorBoundary'
import Layout from './components/Layout'
import Home from './pages/Home'
import FormWizard from './components/FormWizard'
import Success from './pages/Success'

function AppContent() {
  const navigate = useNavigate()

  const handleStartApplication = () => {
    navigate('/application')
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home onStartApplication={handleStartApplication} />} />
        <Route path='/application' element={<FormWizard />} />
        <Route path='/success' element={<Success onBackToHome={handleBackToHome} />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
