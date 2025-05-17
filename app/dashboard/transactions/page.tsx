"use client"

import { useState, useEffect } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Filter,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/components/wallet-provider"
import { useConnection } from "@solana/wallet-adapter-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsPage() {
  const { connected, publicKey } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load transactions when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchTransactions()
    } else {
      setTransactions([])
      setFilteredTransactions([])
    }
  }, [connected, publicKey])

  // Apply filters when search or filter type changes
  useEffect(() => {
    if (transactions.length > 0) {
      let filtered = [...transactions]

      // Apply type filter
      if (filterType !== "all") {
        filtered = filtered.filter((tx) => tx.type === filterType)
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (tx) =>
            tx.signature.toLowerCase().includes(query) ||
            tx.description.toLowerCase().includes(query) ||
            tx.amount.toString().includes(query),
        )
      }

      setFilteredTransactions(filtered)
    }
  }, [searchQuery, filterType, transactions])

  // Fetch transactions from the blockchain
  const fetchTransactions = async () => {
    if (!connected || !publicKey || !connection) return

    setIsLoading(true)
    setIsRefreshing(true)

    try {
      // In a real app, we would fetch actual transactions from the blockchain
      // For now, we'll simulate with mock data
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 20 }, "confirmed")

      // Simulate a delay for loading state
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock transaction data based on real signatures
      const mockTransactions = signatures.map((sig, index) => {
        const isReceived = index % 3 !== 0
        const amount = Number.parseFloat((Math.random() * (isReceived ? 2 : 1) + 0.1).toFixed(4))
        const date = new Date(sig.blockTime ? sig.blockTime * 1000 : Date.now() - index * 3600000)

        return {
          id: index,
          signature: sig.signature,
          type: isReceived ? "received" : "sent",
          status: "confirmed",
          amount: amount,
          token: index % 5 === 0 ? "USDC" : index % 7 === 0 ? "USDT" : "SOL",
          usdValue: amount * (index % 5 === 0 || index % 7 === 0 ? 1 : 150),
          date: date,
          description: isReceived
            ? `Payment received${index % 4 === 0 ? " for services" : ""}`
            : `Payment sent${index % 4 === 0 ? " to supplier" : ""}`,
          fee: 0.000005,
          from: isReceived
            ? `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`
            : publicKey.toString().substring(0, 4) +
              "..." +
              publicKey.toString().substring(publicKey.toString().length - 4),
          to: isReceived
            ? publicKey.toString().substring(0, 4) +
              "..." +
              publicKey.toString().substring(publicKey.toString().length - 4)
            : `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
        }
      })

      setTransactions(mockTransactions)
      setFilteredTransactions(mockTransactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Failed to load transactions",
        description: "Could not retrieve your transaction history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchTransactions()
  }

  const handleCopySignature = (signature: string) => {
    navigator.clipboard.writeText(signature)
    toast({
      title: "Signature copied",
      description: "Transaction signature copied to clipboard",
    })
  }

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no transactions to export",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = ["Date", "Type", "Amount", "Token", "USD Value", "Description", "Signature"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((tx) =>
        [
          new Date(tx.date).toLocaleString(),
          tx.type,
          tx.amount,
          tx.token,
          tx.usdValue.toFixed(2),
          `"${tx.description}"`,
          tx.signature,
        ].join(","),
      ),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `solkart-transactions-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: "Transaction data has been exported to CSV",
    })
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-muted-foreground">View and manage your transaction history</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isLoading || transactions.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {!connected ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Connect your Solana wallet to view your transaction history
              </p>
              <Button onClick={() => {}}>Connect Wallet</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setFilterType("all")}>
                    All
                  </TabsTrigger>
                  <TabsTrigger value="received" onClick={() => setFilterType("received")}>
                    Received
                  </TabsTrigger>
                  <TabsTrigger value="sent" onClick={() => setFilterType("sent")}>
                    Sent
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-9 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterType("all")}>All Transactions</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("received")}>Received Only</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("sent")}>Sent Only</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                      <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                      <DropdownMenuItem>Custom Range</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="hidden md:table-cell">USD Value</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoading ? (
                            // Skeleton loader for transactions
                            Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <TableRow key={i}>
                                  <TableCell>
                                    <Skeleton className="h-6 w-20" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-6 w-24" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-6 w-32" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="h-6 w-16" />
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-6 w-16" />
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Skeleton className="h-8 w-8 ml-auto" />
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : filteredTransactions.length > 0 ? (
                            filteredTransactions.map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`p-1 rounded-full ${
                                        tx.type === "received" ? "bg-green-100" : "bg-blue-100"
                                      }`}
                                    >
                                      {tx.type === "received" ? (
                                        <ArrowDownRight className={`h-4 w-4 text-green-600`} />
                                      ) : (
                                        <ArrowUpRight className={`h-4 w-4 text-blue-600`} />
                                      )}
                                    </div>
                                    <span className="capitalize">{tx.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {tx.date.toLocaleDateString()}{" "}
                                  {tx.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{tx.description}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {tx.signature.substring(0, 8)}...{tx.signature.substring(tx.signature.length - 8)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    className={`font-medium ${
                                      tx.type === "received" ? "text-green-600" : "text-blue-600"
                                    }`}
                                  >
                                    {tx.type === "received" ? "+" : "-"}
                                    {tx.amount} {tx.token}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">${tx.usdValue.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          window.open(`https://explorer.solana.com/tx/${tx.signature}`, "_blank")
                                        }
                                      >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View on Explorer
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleCopySignature(tx.signature)}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy Signature
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Receipt
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                  <Search className="h-8 w-8 mb-2" />
                                  <p>No transactions found</p>
                                  <p className="text-sm">
                                    {searchQuery || filterType !== "all"
                                      ? "Try changing your search or filter"
                                      : "Start using your wallet to see transactions"}
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="received" className="space-y-4">
                {/* This content is controlled by the filter state */}
                <Card>
                  <CardHeader>
                    <CardTitle>Received Transactions</CardTitle>
                    <CardDescription>All incoming payments to your wallet</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="sent" className="space-y-4">
                {/* This content is controlled by the filter state */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sent Transactions</CardTitle>
                    <CardDescription>All outgoing payments from your wallet</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Statistics</CardTitle>
                <CardDescription>Overview of your transaction activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Received</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-2xl font-bold text-green-600">
                        {transactions
                          .filter((tx) => tx.type === "received")
                          .reduce((sum, tx) => sum + tx.amount, 0)
                          .toFixed(4)}{" "}
                        SOL
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">
                        {transactions
                          .filter((tx) => tx.type === "sent")
                          .reduce((sum, tx) => sum + tx.amount, 0)
                          .toFixed(4)}{" "}
                        SOL
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Transaction Count</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-2xl font-bold">{transactions.length}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
