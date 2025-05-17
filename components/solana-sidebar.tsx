"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Wallet,
  Home,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  Users,
  HelpCircle,
  QrCode,
  History,
  Coins,
  Bell,
  Search,
  RefreshCw,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
} from "@/components/ui/sidebar"
import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export function SolanaSidebar() {
  const pathname = usePathname()
  const { connected, publicKey, balance, disconnect, refreshBalance, isFetchingBalance } = useWallet()
  const { setVisible } = useWalletModal()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Use truncated public key for display if connected
  const shortenedAddress = publicKey
    ? `${publicKey.toString().substring(0, 4)}...${publicKey.toString().substring(publicKey.toString().length - 4)}`
    : null

  // Define main navigation items
  const mainNav = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      title: "Point of Sale",
      path: "/dashboard/pos",
      icon: ShoppingCart,
    },
    {
      title: "QR Payments",
      path: "/dashboard/qr",
      icon: QrCode,
    },
    {
      title: "Transactions",
      path: "/dashboard/transactions",
      icon: CreditCard,
    },
    {
      title: "Analytics",
      path: "/dashboard/analytics",
      icon: BarChart3,
    },
  ]

  // Define additional sections
  const managementNav = [
    {
      title: "Customers",
      path: "/dashboard/customers",
      icon: Users,
      badge: "5",
    },
    {
      title: "Token Management",
      path: "/dashboard/tokens",
      icon: Coins,
    },
    {
      title: "Transaction History",
      path: "/dashboard/history",
      icon: History,
    },
  ]

  const supportNav = [
    {
      title: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
      badge: "3",
    },
    {
      title: "Help & Support",
      path: "/dashboard/support",
      icon: HelpCircle,
    },
  ]

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setIsRefreshing(false)
  }

  const handleConnect = () => {
    setVisible(true)
  }

  return (
    <Sidebar>
      <SidebarHeader className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-500">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            SolKart
          </span>
        </div>
        <div className="px-2 pt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <SidebarInput placeholder="Search..." className="pl-8" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-600 dark:text-purple-400">Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.path}
                    tooltip={item.title}
                    className={
                      pathname === item.path
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                        : ""
                    }
                  >
                    <Link href={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-600 dark:text-blue-400">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNav.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.path}
                    tooltip={item.title}
                    className={
                      pathname === item.path ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : ""
                    }
                  >
                    <Link href={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-600 dark:text-emerald-400">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNav.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.path}
                    tooltip={item.title}
                    className={
                      pathname === item.path
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : ""
                    }
                  >
                    <Link href={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-gradient-to-t from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        {connected ? (
          <div className="p-4">
            <div className="rounded-xl border bg-gradient-card p-3 card-hover">
              <div className="flex items-center space-x-3">
                <Avatar className="border-2 border-purple-200">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                    <Wallet className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{shortenedAddress}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{balance.toFixed(4)} SOL</span>
                    <button
                      onClick={handleRefreshBalance}
                      disabled={isFetchingBalance || isRefreshing}
                      className="ml-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={disconnect}
                >
                  <LogOut className="mr-2 h-3 w-3" />
                  Disconnect
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                >
                  <Coins className="mr-2 h-3 w-3" />
                  Deposit
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="rounded-xl border bg-gradient-card p-4 text-center">
              <div className="mb-3 flex justify-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center animate-float">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Connect your Solana wallet to start accepting payments
              </p>
              <Button
                onClick={handleConnect}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
