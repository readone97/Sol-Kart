"use client"

import type React from "react"

import { useState } from "react"
import { useRegistration } from "../registration-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EmailVerificationStep() {
  const { registrationData, updateRegistrationData, setCurrentStep } = useRegistration()
  const [email, setEmail] = useState(registrationData.email)
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError(null)
    if (otpSent) setOtpSent(false)
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
    if (error) setError(null)
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const sendOtp = async () => {
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSending(true)
    setError(null)

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setOtpSent(true)
      updateRegistrationData({ email })
    } catch (err) {
      setError("Failed to send verification code")
    } finally {
      setIsSending(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("Verification code is required")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, let's say "123456" is the valid OTP
      if (otp === "123456") {
        updateRegistrationData({ verified: true })
        setCurrentStep("complete")
      } else {
        setError("Invalid verification code")
      }
    } catch (err) {
      setError("Failed to verify code")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleBack = () => {
    setCurrentStep("username")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Verify Your Email</h2>
        <p className="text-muted-foreground text-sm">We'll send a verification code to your email</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            disabled={isSending || otpSent}
          />
        </div>

        {!otpSent ? (
          <Button onClick={sendOtp} className="w-full" disabled={isSending || !email.trim()}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Code...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={handleOtpChange}
                disabled={isVerifying}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">For demo purposes, use code: 123456</p>
            </div>

            <Button onClick={verifyOtp} className="w-full" disabled={isVerifying || !otp.trim()}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <Button
              variant="link"
              className="w-full text-sm"
              onClick={() => setOtpSent(false)}
              disabled={isSending || isVerifying}
            >
              Change Email
            </Button>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button variant="outline" onClick={handleBack} className="w-full" disabled={isSending || isVerifying}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  )
}
