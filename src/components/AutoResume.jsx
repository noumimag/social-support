import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { isStep1Complete, isStep2Complete } from '../selectors/formSelectors'

export default function AutoResume({ onNavigateToStep }) {
  const step1Ok = useSelector(isStep1Complete)
  const step2Ok = useSelector(isStep2Complete)

  useEffect(() => {
    // Auto-resume to the first incomplete step
    if (!step1Ok) {
      onNavigateToStep(1)
    } else if (!step2Ok) {
      onNavigateToStep(2)
    } else {
      onNavigateToStep(3)
    }
  }, [step1Ok, step2Ok, onNavigateToStep])

  return null
}
