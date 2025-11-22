import { create } from 'zustand'
import { onBoardFormData } from '@/zodSchema/onBoardSchema'

interface OnboardingStore {
    currentStep: number
    formData: Partial<onBoardFormData>
    setCurrentStep: (step: number) => void
    nextStep: () => void
    previousStep: () => void
    updateFormData: (data: Partial<onBoardFormData>) => void
    resetForm: () => void
}

const initialFormData: Partial<onBoardFormData> = {
    username: '',
    role: undefined,
    departmentId: '',
    facultyId: '',
    batch: '',
    theme: 'system',
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
    currentStep: 0,
    formData: initialFormData,
    setCurrentStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    previousStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
    updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    resetForm: () => set({ currentStep: 0, formData: initialFormData }),
}))

