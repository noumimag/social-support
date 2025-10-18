import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  step1: {
    firstName: '',
    lastName: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    isValid: false,
  },
  step2: {
    maritalStatus: '',
    dependents: '',
    employmentStatus: '',
    monthlyIncome: '',
    housingStatus: '',
    isValid: false,
  },
  step3: {
    currentFinancialSituation: { userInput: '', aiSuggestion: '', lastPrompt: '' },
    employmentCircumstances: { userInput: '', aiSuggestion: '', lastPrompt: '' },
    reasonForApplying: { userInput: '', aiSuggestion: '', lastPrompt: '' },
    isValid: false,
  },
  currentStep: 1,
  isComplete: false,
  isFormSubmitted: false,
  meta: {
    lastSaved: 0,
    version: 1,
  },
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateStep1: (state, action) => {
      state.step1 = { ...state.step1, ...action.payload }
    },
    updateStep2: (state, action) => {
      state.step2 = { ...state.step2, ...action.payload }
    },
    updateStep3: (state, action) => {
      state.step3 = { ...state.step3, ...action.payload }
    },
    setStep1Valid: (state, action) => {
      state.step1.isValid = action.payload
    },
    setStep2Valid: (state, action) => {
      state.step2.isValid = action.payload
    },
    setStep3Valid: (state, action) => {
      state.step3.isValid = action.payload
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    setFormComplete: (state, action) => {
      state.isComplete = action.payload
    },
    setFormSubmitted: (state, action) => {
      state.isFormSubmitted = action.payload
    },
    resetForm: () => initialState,
    loadFormData: (state, action) => {
      return { ...state, ...action.payload }
    },
    hydrate: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  updateStep1,
  updateStep2,
  updateStep3,
  setStep1Valid,
  setStep2Valid,
  setStep3Valid,
  setCurrentStep,
  setFormComplete,
  setFormSubmitted,
  resetForm,
  loadFormData,
  hydrate,
} = formSlice.actions

export default formSlice.reducer
