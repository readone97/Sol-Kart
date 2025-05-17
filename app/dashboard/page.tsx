"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  Users,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Wallet,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { Progress } from "@/components/ui/progress"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export default function DashboardPage() {
  const { connected, publicKey, balance, isFetchingBalance } = useWallet()
  const { setVisible } = useWalletModal()
  const [isLoading, setIsLoading] = useState(true)
  const [solBalance, setSolBalance] = useState<number | null>(null);



  
const RPC_ENDPOINT =
"https://serene-wispy-model.solana-mainnet.quiknode.pro/2ebdf944147ac60d02e7030145216e4e1681dd2c/";

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Mock data for token distribution
  const tokenDistribution = [
    { name: "SOL", percentage: 45, color: "purple" },
    { name: "USDC", percentage: 35, color: "blue" },
    { name: "USDT", percentage: 20, color: "green" },
  ]

  // Mock transaction data
  const recentTransactions = [
    {
      type: "received",
      title: "Payment Received",
      time: new Date(Date.now() - 1 * 3600000),
      amount: 0.5,
      token: "SOL",
    },
    {
      type: "converted",
      title: "Token Converted",
      time: new Date(Date.now() - 2 * 3600000),
      amount: 25,
      token: "USDC",
    },
    {
      type: "received",
      title: "Payment Received",
      time: new Date(Date.now() - 5 * 3600000),
      amount: 0.25,
      token: "SOL",
    },
    {
      type: "received",
      title: "Payment Received",
      time: new Date(Date.now() - 8 * 3600000),
      amount: 10,
      token: "USDT",
    },
    {
      type: "converted",
      title: "Token Converted",
      time: new Date(Date.now() - 12 * 3600000),
      amount: 0.3,
      token: "SOL",
    },
  ]

  const handleConnect = () => {
    setVisible(true)
  }
  
  // Get SOL balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;

      try {
        setIsLoading(true);
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast({
          title: "Error",
          description: "Failed to fetch wallet balance. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (connected) {
      fetchBalance();
      // Set up a refresh interval (every 10 seconds)
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    } else {
      setSolBalance(null);
    }
  }, [publicKey, connected, toast]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome to your SolKart merchant dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
        </div>
      </div>

      {!connected ? (
        <div className="rounded-xl border bg-gradient-card p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center animate-float">
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your Solana wallet to view your dashboard statistics and start accepting payments
          </p>
          <Button
            onClick={handleConnect}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger
                value="overview"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="stats-card card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$4,231.89</div>
                    <div className="flex items-center pt-1 text-xs text-green-600">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      <span>+20.1% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="stats-card card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <div className="flex items-center pt-1 text-xs text-green-600">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      <span>+201 since last week</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="stats-card card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+249</div>
                    <div className="flex items-center pt-1 text-xs text-green-600">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      <span>+19.1% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="stats-card card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-amber-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isFetchingBalance ? (
                      <div className="text-2xl font-bold flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </div>
                    ) : balance > 0 ? (
                      <>
                        <div className="text-2xl font-bold">{solBalance} SOL</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                          <span>≈ ${(balance * 150).toFixed(2)} USD</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-2xl font-bold flex items-center">0.0000 SOL</div>
                        <div className="flex items-center pt-1 text-xs text-amber-600">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          <span>Could not fetch balance</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Transactions</CardTitle>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                        <span>View All</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {isLoading
                        ? // Skeleton loader for transactions
                          Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
                                <div className="space-y-2 flex-1">
                                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                                  <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                                </div>
                                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                              </div>
                            ))
                        : recentTransactions.map((tx, i) => (
                            <div key={i} className="flex items-center">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                  tx.type === "received" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {tx.type === "received" ? (
                                  <ArrowDownRight className="h-4 w-4" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                              </div>
                              <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{tx.title}</p>
                                <p className="text-xs text-muted-foreground">{tx.time.toLocaleString()}</p>
                              </div>
                              <div
                                className={`ml-auto font-medium ${
                                  tx.type === "received" ? "text-green-600" : "text-blue-600"
                                }`}
                              >
                                {tx.type === "received" ? "+" : ""}
                                {tx.amount} {tx.token}
                              </div>
                            </div>
                          ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3 card-hover">
                  <CardHeader>
                    <CardTitle>Token Distribution</CardTitle>
                    <CardDescription>Your current token holdings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {isLoading ? (
                        // Skeleton loader for token distribution
                        Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between">
                                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                              </div>
                              <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
                            </div>
                          ))
                      ) : (
                        <>
                          {tokenDistribution.map((token) => (
                            <div key={token.name} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`h-3 w-3 rounded-full bg-${token.color}-500`}></div>
                                  <span className="text-sm font-medium">{token.name}</span>
                                </div>
                                <span className="text-sm">{token.percentage}%</span>
                              </div>
                              <Progress
                                value={token.percentage}
                                className={`h-2 bg-${token.color}-100`}
                                indicatorClassName={`bg-${token.color}-500`}
                              />
                            </div>
                          ))}
                          <div className="h-[180px] w-full rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                  <BarChart3 className="h-6 w-6 text-purple-600" />
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Detailed chart visualization coming soon</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center py-6 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                      >
                        <ShoppingCart className="h-8 w-8 mb-2 text-purple-600" />
                        <span className="text-sm font-medium">New Sale</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center py-6 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                      >
                        <TrendingUp className="h-8 w-8 mb-2 text-blue-600" />
                        <span className="text-sm font-medium">View Reports</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center py-6 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                      >
                        <Users className="h-8 w-8 mb-2 text-green-600" />
                        <span className="text-sm font-medium">Customers</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center py-6 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                      >
                        <DollarSign className="h-8 w-8 mb-2 text-amber-600" />
                        <span className="text-sm font-medium">Convert Tokens</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                        // Skeleton loader for system status
                        Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-muted animate-pulse"></div>
                                <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                              </div>
                              <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                            </div>
                          ))
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-sm font-medium">Solana Network</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Operational
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-sm font-medium">Payment Processing</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Operational
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-sm font-medium">Token Conversion</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Operational
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-sm font-medium">Analytics</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Operational
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Detailed analytics will be displayed here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full rounded-md border flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <p className="text-sm font-medium mb-1">Analytics Coming Soon</p>
                      <p className="text-sm text-muted-foreground">Detailed analytics will be implemented in Phase 2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and view reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full rounded-md border flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <p className="text-sm font-medium mb-1">Reports Coming Soon</p>
                      <p className="text-sm text-muted-foreground">
                        Reporting functionality will be implemented in Phase 2
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
