"use client"

import { useState } from "react"
import { Coins, RefreshCw, ArrowUpRight, ArrowDownRight, Copy, ExternalLink, Info, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/components/wallet-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

export default function TokenManagementPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const { connected, connect } = useWallet()

  // Token balances (mock data)
  const tokenBalances = [
    { symbol: "SOL", name: "Solana", balance: 1.25, usdValue: 187.5, iconColor: "purple" },
    { symbol: "USDC", name: "USD Coin", balance: 543.21, usdValue: 543.21, iconColor: "blue" },
    { symbol: "USDT", name: "Tether", balance: 120.42, usdValue: 120.42, iconColor: "green" },
    { symbol: "BONK", name: "Bonk", balance: 1250000, usdValue: 62.5, iconColor: "yellow" },
  ]

  // Calculate total USD value
  const totalUsdValue = tokenBalances.reduce((acc, token) => acc + token.usdValue, 0)

  const refreshBalances = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Balances refreshed",
        description: "Your token balances have been updated",
      })
    }, 1500)
  }

  const handleCopyAddress = () => {
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  // Recent token transaction history (mock data)
  const recentTransactions = [
    { type: "received", token: "SOL", amount: 0.5, date: new Date(Date.now() - 3600000), txid: "2xC5v...8jKl" },
    { type: "sent", token: "USDC", amount: 25, date: new Date(Date.now() - 86400000), txid: "9pL3r...2sWq" },
    { type: "received", token: "BONK", amount: 500000, date: new Date(Date.now() - 172800000), txid: "7tY6h...3zBn" },
    { type: "sent", token: "SOL", amount: 0.1, date: new Date(Date.now() - 259200000), txid: "4gF7j...1pXr" },
    { type: "received", token: "USDT", amount: 100, date: new Date(Date.now() - 345600000), txid: "6hJ8k...5vCm" },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Token Management</h1>
            <p className="text-muted-foreground">Manage and track your Solana token portfolio</p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshBalances} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {!connected ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Coins className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Connect your Solana wallet to view token balances and manage your crypto assets
              </p>
              <Button onClick={connect}>Connect Wallet</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
                <CardDescription>Your total balance: ${totalUsdValue.toFixed(2)} USD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Distribution Chart */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Asset Allocation</span>
                      <span className="text-muted-foreground">% of portfolio</span>
                    </div>
                    <div className="space-y-2">
                      {tokenBalances.map((token) => {
                        const percentage = (token.usdValue / totalUsdValue) * 100
                        return (
                          <div key={token.symbol} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>
                                {token.name} ({token.symbol})
                              </span>
                              <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={percentage} className={`h-2 bg-${token.iconColor}-100`} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="tokens" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tokens">Token Balances</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="swap">Swap Tokens</TabsTrigger>
              </TabsList>

              <TabsContent value="tokens" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {tokenBalances.map((token) => (
                    <Card key={token.symbol}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{token.symbol}</CardTitle>
                          <div
                            className={`h-8 w-8 rounded-full bg-${token.iconColor}-100 flex items-center justify-center`}
                          >
                            <Coins className={`h-4 w-4 text-${token.iconColor}-500`} />
                          </div>
                        </div>
                        <CardDescription>{token.name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{token.balance.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">${token.usdValue.toFixed(2)} USD</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button variant="outline" size="sm">
                            <ArrowUpRight className="mr-2 h-3 w-3" />
                            Send
                          </Button>
                          <Button variant="outline" size="sm">
                            <ArrowDownRight className="mr-2 h-3 w-3" />
                            Receive
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Receive Tokens Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Receive Tokens</CardTitle>
                    <CardDescription>Your Solana wallet address for receiving tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Input value="4rL4RCWHz3iNCdCgF3S73Y2EJpin7hzJXxLYX7mFuMJv" readOnly />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={handleCopyAddress}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy wallet address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on Solana Explorer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      <p>Only send Solana (SOL) and SPL tokens to this address.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent token transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentTransactions.map((tx, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                tx.type === "received" ? "bg-green-100" : "bg-orange-100"
                              }`}
                            >
                              {tx.type === "received" ? (
                                <ArrowDownRight className="h-5 w-5 text-green-600" />
                              ) : (
                                <ArrowUpRight className="h-5 w-5 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {tx.type === "received" ? "Received" : "Sent"} {tx.token}
                              </p>
                              <p className="text-sm text-muted-foreground">{tx.date.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${tx.type === "received" ? "text-green-600" : "text-orange-600"}`}
                            >
                              {tx.type === "received" ? "+" : "-"}
                              {tx.amount} {tx.token}
                            </p>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              <span className="text-xs">{tx.txid}</span>
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="swap">
                <Card>
                  <CardHeader>
                    <CardTitle>Swap Tokens</CardTitle>
                    <CardDescription>Exchange your tokens for other SPL tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>From</Label>
                        <div className="flex space-x-2">
                          <Select defaultValue="SOL">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              {tokenBalances.map((token) => (
                                <SelectItem key={token.symbol} value={token.symbol}>
                                  {token.symbol} ({token.balance.toLocaleString()})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input type="number" placeholder="0.00" />
                        </div>
                        <div className="text-sm text-right text-muted-foreground">Balance: 1.25 SOL</div>
                      </div>

                      <div className="flex justify-center">
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <ArrowDownRight className="h-6 w-6 rotate-45" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>To</Label>
                        <div className="flex space-x-2">
                          <Select defaultValue="USDC">
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              {tokenBalances.map((token) => (
                                <SelectItem key={token.symbol} value={token.symbol}>
                                  {token.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input type="number" placeholder="0.00" readOnly value="150.00" />
                        </div>
                      </div>

                      <div className="space-y-2 bg-muted p-4 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Price</span>
                          <span>1 SOL = 150 USDC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Network Fee</span>
                          <span>0.000005 SOL</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Minimum Received</span>
                          <span>149.25 USDC</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Slippage Tolerance</Label>
                        <div className="flex justify-between gap-2">
                          <div className="flex-1">
                            <Slider defaultValue={[0.5]} max={5} step={0.1} />
                          </div>
                          <div className="flex w-20 items-center rounded-md border border-input bg-background px-2">
                            <Input
                              type="number"
                              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                              defaultValue={0.5}
                            />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Review Swap
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
