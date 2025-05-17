"use client"

import { useRegistration } from "./registration-context"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Fix dynamic imports to ensure they resolve to proper React components
const WalletConnectionStep = dynamic(() => import("./steps/wallet-connection-step").then((mod) => mod.default), {
  loading: () => <StepLoader text="Loading wallet connection..." />,
  ssr: false, // Disable SSR for wallet adapter components
})

const UsernameStep = dynamic(() => import("./steps/username-step").then((mod) => mod.default), {
  loading: () => <StepLoader text="Loading..." />,
})

const EmailVerificationStep = dynamic(() => import("./steps/email-verification-step").then((mod) => mod.default), {
  loading: () => <StepLoader text="Loading..." />,
})

const CompletionStep = dynamic(() => import("./steps/completion-step").then((mod) => mod.default), {
  loading: () => <StepLoader text="Loading..." />,
})

function StepLoader({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export default function RegistrationFlow() {
  const { currentStep } = useRegistration()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <ProgressIndicator currentStep={currentStep} />

      {currentStep === "wallet" && <WalletConnectionStep />}
      {currentStep === "username" && <UsernameStep />}
      {currentStep === "email" && <EmailVerificationStep />}
      {currentStep === "complete" && <CompletionStep />}
    </div>
  )
}

function ProgressIndicator({ currentStep }: { currentStep: string }) {
  const steps = [
    { id: "wallet", label: "Connect Wallet" },
    { id: "username", label: "Username" },
    { id: "email", label: "Verify Email" },
    { id: "complete", label: "Complete" },
  ]

  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                index <= currentIndex ? "bg-black text-white" : "bg-black text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 hidden sm:block">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="h-1 w-full bg-muted"></div>
        </div>
        <div className="absolute inset-0 flex items-center">
          <div
            className="h-1 bg-black transition-all duration-300 ease-in-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
