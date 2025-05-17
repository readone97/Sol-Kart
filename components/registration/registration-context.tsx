"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type RegistrationStep = "wallet" | "username" | "email" | "complete"

interface RegistrationData {
  walletAddress: string | null
  username: string
  email: string
  verified: boolean
}

interface RegistrationContextType {
  currentStep: RegistrationStep
  registrationData: RegistrationData
  setCurrentStep: (step: RegistrationStep) => void
  updateRegistrationData: (data: Partial<RegistrationData>) => void
  resetRegistration: () => void
}

const initialData: RegistrationData = {
  walletAddress: null,
  username: "",
  email: "",
  verified: false,
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("wallet")
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialData)

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }))
  }

  const resetRegistration = () => {
    setCurrentStep("wallet")
    setRegistrationData(initialData)
  }

  return (
    <RegistrationContext.Provider
      value={{
        currentStep,
        registrationData,
        setCurrentStep,
        updateRegistrationData,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const context = useContext(RegistrationContext)
  if (context === undefined) {
    throw new Error("useRegistration must be used within a RegistrationProvider")
  }
  return context
}
