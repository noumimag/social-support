import { configureStore } from '@reduxjs/toolkit'
import formReducer from './formSlice'
import { loadFormData, saveFormData } from '../services/storage'

// Hydrate Redux on app start
const preloaded = loadFormData()

export const store = configureStore({
  reducer: {
    form: formReducer,
  },
  preloadedState: preloaded ? { form: preloaded } : undefined,
})

// Autosave with debounce
let t
store.subscribe(() => {
  clearTimeout(t)
  t = setTimeout(() => {
    const state = store.getState().form
    saveFormData(state)
  }, 400)
})
