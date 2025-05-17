"use client"

import { useState, useEffect } from "react"
import { QrCode, Copy, CheckCircle, Wallet, RefreshCw, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/components/wallet-provider"
import { Badge } from "@/components/ui/badge"
import { createQR } from "@solana/pay"
import Image from "next/image"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export default function SolanaQRPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isQRGenerated, setIsQRGenerated] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState("SOL")
  const [memo, setMemo] = useState("")
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const { toast } = useToast()
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [recentPayments, setRecentPayments] = useState<any[]>([])

  // Load recent payments from localStorage on component mount
  useEffect(() => {
    const savedPayments = localStorage.getItem("recentPayments")
    if (savedPayments) {
      try {
        setRecentPayments(JSON.parse(savedPayments))
      } catch (e) {
        console.error("Failed to parse saved payments:", e)
      }
    }
  }, [])

  // Save a new payment to recent payments
  const savePayment = (payment: any) => {
    const updatedPayments = [payment, ...recentPayments.slice(0, 9)]
    setRecentPayments(updatedPayments)
    localStorage.setItem("recentPayments", JSON.stringify(updatedPayments))
  }

  const handleGenerateQR = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Call the API to generate a payment request
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      const { url, ref } = data

      console.log("Payment URL:", url)
      console.log("Reference:", ref)

      // Generate QR code from the URL
      const qr = createQR(url)
      const qrBlob = await qr.getRawData("png")

      if (!qrBlob) {
        throw new Error("Failed to generate QR code")
      }

      // Convert blob to base64 string
      const reader = new FileReader()
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setQrCodeImage(event.target?.result)
          setIsQRGenerated(true)

          // Save this payment request
          savePayment({
            id: ref,
            amount: Number.parseFloat(amount),
            token,
            memo: memo || `Payment of ${amount} ${token}`,
            status: "pending",
            created: new Date().toISOString(),
            url,
          })

          toast({
            title: "QR Code Generated",
            description: `Payment request for ${amount} ${token} created successfully`,
          })
        }
      }
      reader.readAsDataURL(qrBlob)

      // Set the reference for verification
      setReference(ref)
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: `Failed to generate QR code: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVerifyPayment = async () => {
    if (!reference) {
      toast({
        title: "Cannot verify payment",
        description: "Missing reference information to verify payment",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      // Call the API to verify the payment
      const res = await fetch(`/api/pay?reference=${reference}`)

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      const { status } = data

      if (status === "verified") {
        setPaymentVerified(true)

        // Update payment status in recent payments
        const updatedPayments = recentPayments.map((payment) =>
          payment.id === reference ? { ...payment, status: "completed" } : payment,
        )
        setRecentPayments(updatedPayments)
        localStorage.setItem("recentPayments", JSON.stringify(updatedPayments))

        toast({
          title: "Payment Verified",
          description: "The payment has been successfully verified on the Solana blockchain",
        })
      } else {
        toast({
          title: "Payment not found",
          description: "No payment transaction was found. The customer may not have paid yet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      toast({
        title: "Verification failed",
        description: `Could not verify the payment: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const resetForm = () => {
    setAmount("")
    setToken("SOL")
    setMemo("")
    setIsQRGenerated(false)
    setPaymentVerified(false)
    setReference(null)
    setQrCodeImage(null)
  }

  const copyToClipboard = () => {
    if (reference) {
      navigator.clipboard.writeText(`Payment Reference: ${reference}`)
      toast({
        title: "Reference Copied",
        description: "Payment reference copied to clipboard",
      })
    }
  }

  const handleConnect = () => {
    setVisible(true)
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Solana QR Payments
          </h1>
        </div>

        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="recent">Recent Payments</TabsTrigger>
            <TabsTrigger value="settings">QR Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Payment Form & QR Display */}
              <div className="space-y-6">
                {!isQRGenerated ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Payment Request</CardTitle>
                      <CardDescription>Generate a QR code for customers to scan and pay with Solana</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="token">Token</Label>
                        <Select value={token} onValueChange={setToken}>
                          <SelectTrigger id="token">
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SOL">SOL</SelectItem>
                            <SelectItem value="USDC">USDC</SelectItem>
                            <SelectItem value="USDT">USDT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="memo">Memo (Optional)</Label>
                        <Input
                          id="memo"
                          placeholder="Payment for..."
                          value={memo}
                          onChange={(e) => setMemo(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      {connected ? (
                        <Button onClick={handleGenerateQR} disabled={isGenerating} className="w-full">
                          {isGenerating ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <QrCode className="mr-2 h-6 w-6" />
                              Generate QR Code
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button onClick={handleConnect} className="w-full">
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect Wallet First
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment QR Code</CardTitle>
                      <CardDescription>Let your customer scan this QR code to complete the payment</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                      {paymentVerified ? (
                        <div className="text-center p-6 space-y-4">
                          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-xl font-medium">Payment Verified!</h3>
                          <p className="text-muted-foreground">
                            {amount} {token} has been received
                          </p>
                          <div className="pt-4">
                            <Button onClick={resetForm} className="w-full">
                              <ArrowRight className="mr-2 h-4 w-4" />
                              Create New Payment
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="qr-container mx-auto">
                            {qrCodeImage ? (
                              <div
                                className="bg-white p-2 rounded flex items-center justify-center"
                                style={{ width: "256px", height: "256px" }}
                              >
                                <Image
                                  src={qrCodeImage || "/placeholder.svg"}
                                  alt="Solana Pay QR Code"
                                  width={200}
                                  height={200}
                                  style={{ background: "white" }}
                                  priority
                                />
                              </div>
                            ) : (
                              <div
                                className="bg-white p-2 rounded flex items-center justify-center"
                                style={{ width: "256px", height: "256px" }}
                              >
                                <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                              </div>
                            )}
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-xl font-bold">
                              {amount} {token}
                            </p>
                            <p className="text-sm text-muted-foreground">Scan with any Solana wallet app</p>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Waiting for payment...
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Reference
                            </Button>
                            <Button className="flex-1" onClick={handleVerifyPayment} disabled={isVerifying}>
                              {isVerifying ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Verify Payment
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Payment Information and Guides */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>Details about your payment request</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isQRGenerated ? (
                      <div className="text-center py-6">
                        <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Fill out the form to generate a payment QR code</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">
                            {paymentVerified ? (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle className="inline-block mr-1 h-4 w-4" />
                                Completed
                              </span>
                            ) : (
                              <span className="text-yellow-600 flex items-center">
                                <RefreshCw className="inline-block mr-1 h-4 w-4 animate-spin" />
                                Awaiting Payment
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">
                            {amount} {token}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">USD Value:</span>
                          <span className="font-medium">
                            ${(Number.parseFloat(amount) * (token === "SOL" ? 150 : 1)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{new Date().toLocaleString()}</span>
                        </div>
                        {reference && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reference:</span>
                            <span className="text-xs truncate max-w-[150px]">{reference}</span>
                          </div>
                        )}
                        <div className="pt-2">
                          {publicKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() =>
                                window.open(`https://explorer.solana.com/address/${publicKey.toString()}`, "_blank")
                              }
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Wallet on Solana Explorer
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Generate a QR code</p>
                          <p className="text-sm text-muted-foreground">
                            Specify amount and token type to create payment request
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Customer scans QR</p>
                          <p className="text-sm text-muted-foreground">
                            Customer scans with any Solana wallet app to pay
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Verify payment</p>
                          <p className="text-sm text-muted-foreground">
                            Funds are transferred directly to your wallet on-chain
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent QR Payments</CardTitle>
                <CardDescription>View and manage your recent QR code payment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.length > 0 ? (
                    recentPayments.map((payment, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex gap-4">
                          <div
                            className={`h-10 w-10 rounded-full ${
                              payment.status === "completed"
                                ? "bg-green-100"
                                : payment.status === "pending"
                                  ? "bg-yellow-100"
                                  : "bg-muted"
                            } flex items-center justify-center`}
                          >
                            <QrCode
                              className={
                                payment.status === "completed"
                                  ? "h-5 w-5 text-green-600"
                                  : payment.status === "pending"
                                    ? "h-5 w-5 text-yellow-600"
                                    : "h-5 w-5 text-muted-foreground"
                              }
                            />
                          </div>
                          <div>
                            <div className="font-medium">
                              {payment.amount} {payment.token}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(payment.created).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {payment.status === "completed"
                              ? "Completed"
                              : payment.status === "pending"
                                ? "Pending"
                                : "Expired"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payment history yet</p>
                      <p className="text-sm">Generate a QR code to create your first payment request</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>QR Payment Settings</CardTitle>
                <CardDescription>Customize your Solana QR payment experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultToken">Default Token</Label>
                  <Select defaultValue="SOL">
                    <SelectTrigger id="defaultToken">
                      <SelectValue placeholder="Select default token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryTime">Payment Expiry Time</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="expiryTime">
                      <SelectValue placeholder="Select expiry time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                      <SelectItem value="never">Never expire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name on QR</Label>
                  <Input id="businessName" placeholder="Your business name" defaultValue="SolKart Store" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptTemplate">Receipt Template</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="receiptTemplate">
                      <SelectValue placeholder="Select receipt template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
