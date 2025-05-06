import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { QueryProvider } from "@/components/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: "SolSwap - Solana DEX",
  description: "Swap tokens on Solana with the best rates",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="solswap-theme">
          <QueryProvider>
            <WalletProvider>
              <Suspense>
                {children}
                <Toaster />
                <Analytics />
              </Suspense>
            </WalletProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
