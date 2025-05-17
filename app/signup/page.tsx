"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Wallet, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // In a real app, we would call an API to create the account
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      })

      // Move to next step or redirect
      if (step < 3) {
        setStep(step + 1)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            {step === 1 && "Enter your details to create your account"}
            {step === 2 && "Set up your business profile"}
            {step === 3 && "Create your Solana wallet"}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Fill in your details to get started with SolKart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="Your Business Name"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Business Profile</CardTitle>
                  <CardDescription>Tell us more about your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input id="businessType" placeholder="Retail, Restaurant, Service, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input id="address" placeholder="Street Address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input id="zipCode" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" />
                  </div>
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Create Your Wallet</CardTitle>
                  <CardDescription>Set up your Solana wallet to receive payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p>
                      We'll create a secure Solana wallet for your business. This wallet will be used to receive
                      payments from your customers.
                    </p>
                    <p className="mt-2 font-medium">
                      Important: You'll receive a recovery phrase that you must store securely.
                    </p>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    <Wallet className="h-16 w-16 text-primary" />
                  </div>
                </CardContent>
              </>
            )}

            <CardFooter>
              <div className="flex w-full flex-col gap-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>{step < 3 ? "Continue" : "Create Wallet & Complete Setup"}</>
                  )}
                </Button>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep(step - 1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
