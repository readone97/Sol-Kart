"use client"

import type React from "react"
import { Wallet } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SolanaSidebar } from "@/components/solana-sidebar"
import { useWallet } from "@/components/wallet-provider"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { connected, balance } = useWallet()

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <SolanaSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-glass px-4 md:px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2 font-bold md:hidden">
              <Wallet className="h-5 w-5 text-primary" />
              <span>SolKart</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
              <WalletConnectButton />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
