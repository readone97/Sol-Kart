"use client"

import { useState } from "react"
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WalletConnectButton() {
  const { connected, publicKey, balance, disconnect, isFetchingBalance, refreshBalance } = useWallet()
  const { setVisible } = useWalletModal()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Format public key for display
  const formattedAddress = publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : ""

  const handleConnect = () => {
    setVisible(true)
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setIsRefreshing(false)
  }

  const handleViewOnExplorer = () => {
    if (publicKey) {
      window.open(`https://explorer.solana.com/address/${publicKey.toString()}`, "_blank")
    }
  }

  if (!connected) {
    return (
      <Button
        onClick={handleConnect}
        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-purple-200 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>{formattedAddress}</span>
            {isFetchingBalance ? (
              <span className="text-muted-foreground flex items-center">
                <span className="animate-pulse">...</span>
              </span>
            ) : balance > 0 ? (
              <span className="text-muted-foreground">{balance.toFixed(4)} SOL</span>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-amber-600 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Error
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Could not fetch balance. Click to retry.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewOnExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRefreshBalance} disabled={isFetchingBalance || isRefreshing}>
          <svg
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          Refresh Balance
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
