import Link from "next/link"
import { ArrowRight, Wallet, ShoppingCart, BarChart3, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Wallet className="h-5 w-5 text-primary" />
            <span>SolKart</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Accept Solana Payments with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SolKart helps small businesses accept Solana-based SPL tokens without technical expertise. Start
                    accepting crypto payments today.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-4 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-4 text-center">
                    <ShoppingCart className="h-12 w-12 text-primary" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Point-of-Sale Demo</h3>
                      <p className="text-sm text-muted-foreground">
                        Try our interactive demo to see how easy it is to accept Solana payments
                      </p>
                    </div>
                    <Button variant="secondary">Launch Demo</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Everything you need to start accepting Solana payments in your business
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader>
                  <Wallet className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Simplified Wallet Setup</CardTitle>
                  <CardDescription>Guided process to create and secure your Solana wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No technical knowledge required. We'll walk you through every step of creating and securing your
                    wallet.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ShoppingCart className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Easy Point-of-Sale</CardTitle>
                  <CardDescription>Simple interface for processing customer payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate QR codes, accept payments, and provide receipts with just a few taps.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Transaction Dashboard</CardTitle>
                  <CardDescription>Track sales and manage your crypto portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View transaction history, analyze sales data, and monitor your token balances in real-time.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Secure Transactions</CardTitle>
                  <CardDescription>Enterprise-grade security for your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    End-to-end encryption and secure key management to protect your funds and customer data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold">
              <Wallet className="h-5 w-5 text-primary" />
              <span>SolKart</span>
            </div>
            <p className="text-sm text-muted-foreground">Accept Solana payments with ease</p>
          </div>
          <div className="ml-auto flex flex-col gap-2 md:flex-row md:gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Product</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Integrations
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Company</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Legal</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookies
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="container py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SolKart. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
