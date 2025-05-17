"use client"

import type React from "react"

import { useState } from "react"
import { useRegistration } from "../registration-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UsernameStep() {
  const { registrationData, updateRegistrationData, setCurrentStep } = useRegistration()
  const [username, setUsername] = useState(registrationData.username)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    if (error) setError(null)
  }

  const checkUsernameAvailability = async () => {
    // This would be a real API call in production
    setIsChecking(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, let's say usernames with "taken" are not available
      if (username.toLowerCase().includes("taken")) {
        setError("This username is already taken")
        return false
      }

      return true
    } catch (err) {
      setError("Error checking username availability")
      return false
    } finally {
      setIsChecking(false)
    }
  }

  const handleContinue = async () => {
    if (!username.trim()) {
      setError("Username is required")
      return
    }

    // Username validation
    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores")
      return
    }

    const isAvailable = await checkUsernameAvailability()
    if (isAvailable) {
      updateRegistrationData({ username })
      setCurrentStep("email")
    }
  }

  const handleBack = () => {
    setCurrentStep("wallet")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Create Your Username</h2>
        <p className="text-muted-foreground text-sm">Choose a unique username for your account</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
            disabled={isChecking}
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={handleBack} className="w-1/3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} className="w-2/3" disabled={isChecking || !username.trim()}>
          {isChecking ? "Checking..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
