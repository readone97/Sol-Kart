// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import "./globals.css"
// //import { ThemeProvider } from "@/components/theme-provider"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Amigo Exchange",
//   description: "Seamless Crypto to Fiat Exchange Platform",
//     generator: 'v0.dev'
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className="dark" suppressHydrationWarning>
//       <body className={inter.className}>
       
//           {children}
//           <Toaster />
       
//       </body>
//     </html>
//   )
// }



// import './globals.css'
// import { Toaster } from "@/components/ui/toaster"


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolKart - Accept Solana Payments for Small Businesses",
  description: "A decentralized platform for small businesses to accept Solana-based SPL tokens",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

