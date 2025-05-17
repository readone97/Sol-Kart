"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { type PublicKey, LAMPORTS_PER_SOL, Connection, clusterApiUrl } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet as useSolanaWallet,
  useConnection,
} from "@solana/wallet-adapter-react"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  // Remove the adapters that aren't available
  // BackpackWalletAdapter,
  // CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { WalletModalProvider, useWalletModal } from "@solana/wallet-adapter-react-ui"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

type WalletContextType = {
  connected: boolean
  publicKey: PublicKey | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
  isLoading: boolean
  walletModalOpen: boolean
  setWalletModalOpen: (open: boolean) => void
  solBalance: number
  isFetchingBalance: boolean
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  balance: 0,
  connect: async () => {},
  disconnect: () => {},
  isLoading: false,
  walletModalOpen: false,
  setWalletModalOpen: () => {},
  solBalance: 0,
  isFetchingBalance: false,
  refreshBalance: async () => {},
})

export const useWallet = () => useContext(WalletContext)

// Inner wallet component that uses the Solana wallet adapter
function WalletProviderInner({ children }: { children: ReactNode }) {
  const { connection } = useConnection()
  const { publicKey, connected, disconnect } = useSolanaWallet()
  const { setVisible } = useWalletModal()
  const [isLoading, setIsLoading] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [solBalance, setSolBalance] = useState(0)
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const { toast } = useToast()

  // Fetch SOL balance when wallet is connected
  const fetchBalance = async () => {
    if (!publicKey || !connection) return

    try {
      setIsFetchingBalance(true)

      // Try to get balance with the primary connection
      try {
        const balance = await connection.getBalance(publicKey)
        setSolBalance(balance / LAMPORTS_PER_SOL)
        return
      } catch (primaryError) {
        console.warn("Primary connection failed, trying fallback:", primaryError)

        // If primary connection fails, try with a fallback connection
        const fallbackRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta")
        const fallbackConnection = new Connection(fallbackRpcUrl, "confirmed")

        try {
          const balance = await fallbackConnection.getBalance(publicKey)
          setSolBalance(balance / LAMPORTS_PER_SOL)

          // Log that we're using the fallback
          console.info("Using fallback RPC connection")
        } catch (fallbackError) {
          // If both fail, throw the original error
          throw primaryError
        }
      }
    } catch (error) {
      console.error("Error fetching balance:", error)

      // Set a default balance to prevent UI issues
      setSolBalance(0)

      // Only show toast if this isn't the initial load
      if (solBalance > 0) {
        toast({
          title: "Error fetching balance",
          description: "Could not retrieve your wallet balance. Using cached value.",
          variant: "destructive",
        })
      }
    } finally {
      setIsFetchingBalance(false)
    }
  }

  // Refresh balance manually
  const refreshBalance = async () => {
    await fetchBalance()
  }

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()

      // Set up interval to refresh balance periodically
      const intervalId = setInterval(fetchBalance, 30000) // Every 30 seconds

      return () => clearInterval(intervalId)
    } else {
      setSolBalance(0)
    }
  }, [connected, publicKey])

  // Connect wallet function
  const connect = async () => {
    setIsLoading(true)
    try {
      // Open wallet modal
      setVisible(true)
      setWalletModalOpen(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle disconnect
  const handleDisconnect = () => {
    try {
      disconnect()
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  // Update modal state when visibility changes
  useEffect(() => {
    const handleWalletModalVisibilityChange = () => {
      if (!connected) {
        setWalletModalOpen(false)
      }
    }

    // Check after a delay to allow connection to complete
    const timer = setTimeout(handleWalletModalVisibilityChange, 300)
    return () => clearTimeout(timer)
  }, [connected])

  // Create context value
  const contextValue = useMemo<WalletContextType>(
    () => ({
      connected,
      publicKey,
      balance: solBalance,
      connect,
      disconnect: handleDisconnect,
      isLoading,
      walletModalOpen,
      setWalletModalOpen,
      solBalance,
      isFetchingBalance,
      refreshBalance,
    }),
    [connected, publicKey, solBalance, isLoading, walletModalOpen, isFetchingBalance],
  )

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

// Main wallet provider that sets up the Solana wallet adapter
export function WalletProvider({ children }: { children: ReactNode }) {
  // Set up endpoint with fallbacks
  const endpoint = useMemo(() => {
    // Try to use the environment variable
    const envEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL

    if (envEndpoint && envEndpoint.trim() !== "") {
      return envEndpoint
    }

    // Fallback to mainnet-beta if no environment variable is set
    return clusterApiUrl("mainnet-beta")
  }, [])

  // Set up supported wallets - only use the ones that are definitely available
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Removed the problematic adapters
    ],
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletProviderInner>{children}</WalletProviderInner>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
