"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, QrCode, Check, Copy, Loader2, DollarSign, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/components/wallet-provider"

export default function POSPage() {
  const [amount, setAmount] = useState("")
  const [tokenType, setTokenType] = useState("SOL")
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState(1)
  const { toast } = useToast()
  const { connected } = useWallet()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)
  }

  const handleCreatePayment = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real app, we would call an API to create a payment
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      setPaymentStep(2)

      toast({
        title: "Payment created",
        description: "QR code generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    // In a real app, we would copy the payment link to clipboard
    toast({
      title: "Link copied",
      description: "Payment link copied to clipboard",
    })
  }

  const handleCompletePayment = async () => {
    setLoading(true)

    try {
      // In a real app, we would verify the payment
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      setPaymentStep(3)

      toast({
        title: "Payment completed",
        description: "Payment has been received successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetPayment = () => {
    setAmount("")
    setTokenType("SOL")
    setPaymentStep(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
      </div>

      <Tabs defaultValue="payment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payment">New Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              {paymentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create Payment</CardTitle>
                    <CardDescription>Enter the payment details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          placeholder="0.00"
                          className="pl-9"
                          value={amount}
                          onChange={handleAmountChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Token Type</Label>
                      <RadioGroup
                        defaultValue="SOL"
                        value={tokenType}
                        onValueChange={setTokenType}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="SOL" id="SOL" />
                          <Label htmlFor="SOL" className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary"></div>
                            SOL
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="USDC" id="USDC" />
                          <Label htmlFor="USDC" className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                            USDC
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="USDT" id="USDT" />
                          <Label htmlFor="USDT" className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-green-500"></div>
                            USDT
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleCreatePayment}
                      disabled={loading || !amount || Number.parseFloat(amount) <= 0}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating payment...
                        </>
                      ) : (
                        "Create Payment"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {paymentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment QR Code</CardTitle>
                    <CardDescription>Scan this QR code to complete payment</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="rounded-lg border bg-muted p-2">
                      <div className="h-64 w-64 bg-white flex items-center justify-center">
                        <QrCode className="h-48 w-48 text-primary" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {amount} {tokenType}
                      </p>
                      <p className="text-sm text-muted-foreground">Payment will expire in 10 minutes</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Payment Link
                    </Button>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button onClick={handleCompletePayment} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying payment...
                        </>
                      ) : (
                        "Verify Payment"
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetPayment} className="w-full" disabled={loading}>
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {paymentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Complete</CardTitle>
                    <CardDescription>The payment has been received</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {amount} {tokenType} Received
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID: SOL{Math.random().toString(36).substring(2, 10)}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button onClick={resetPayment} className="w-full">
                      New Payment
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Receipt
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentStep === 1 ? (
                    <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
                      Enter payment details to generate a QR code
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-2xl font-bold">
                          {amount} {tokenType}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Status</p>
                        <div className="flex items-center gap-2">
                          {paymentStep === 2 ? (
                            <>
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <p>Pending</p>
                            </>
                          ) : (
                            <>
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <p>Completed</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Created</p>
                        <p>{new Date().toLocaleString()}</p>
                      </div>
                      {paymentStep === 3 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Completed</p>
                          <p>{new Date().toLocaleString()}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {!connected && (
                    <Button variant="outline" className="w-full">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </Button>
                  )}
                </CardFooter>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      <CreditCard className="mr-2 h-4 w-4" />
                      View Transactions
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Convert Tokens
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your recent payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          i % 3 === 0 ? "bg-primary/10" : i % 3 === 1 ? "bg-blue-500/10" : "bg-green-500/10"
                        }`}
                      >
                        <CreditCard
                          className={`h-4 w-4 ${
                            i % 3 === 0 ? "text-primary" : i % 3 === 1 ? "text-blue-500" : "text-green-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">Payment #{1000 + i}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(Math.random() * 100).toFixed(2)} {i % 3 === 0 ? "SOL" : i % 3 === 1 ? "USDC" : "USDT"}
                      </p>
                      <p className="text-xs text-muted-foreground">${(Math.random() * 1000).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
