"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRegistration } from "../registration-context"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function CompletionStep() {
  const router = useRouter()
  const { registrationData } = useRegistration()

  // Auto-redirect after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Registration Complete!</h2>
        <p className="text-muted-foreground text-sm">Your account has been successfully created</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Account Details</p>
        <div className="text-sm text-muted-foreground">
          <p>Username: {registrationData.username}</p>
          <p>Email: {registrationData.email}</p>
          <p className="truncate">Wallet: {registrationData.walletAddress}</p>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={() => router.push("/dashboard")} className="w-full">
          Go to Dashboard
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Redirecting to dashboard in a few seconds...</p>
      </div>
    </div>
  )
}
