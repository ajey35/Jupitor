"use client"

import { useState } from "react"
import Link from "next/link"
import { useWallet } from "@lazorkit/wallet"
import { Menu, Search, X } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { toast } from "sonner" // or use your preferred toast library
import { Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const {
    isConnected,
    publicKey,
    connect,
    disconnect,
    smartWalletAuthorityPubkey,
  } = useWallet()
  const [searchValue, setSearchValue] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const formatWalletAddress = () => {
    if (!publicKey || !smartWalletAuthorityPubkey) return ""
    return `${publicKey.toString().slice(0, 4)}...${smartWalletAuthorityPubkey.toString().slice(-4)}`
  }

  return (
    <nav className="border-b border-[rgba(255,255,255,0.1)] backdrop-blur-md bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo and Nav Links */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="SolSwap Logo"
              className="h-8 w-8"
              loading="lazy"
            />
            <span className="font-bold text-lg">Jupitor</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6">
            <NavLink href="/" active>
              Spot
            </NavLink>
            <NavLink  href="/">Pro</NavLink>
            <NavLink href="/">Perps</NavLink>
            
          </div>
        </div>

        {/* Right-side Controls */}
        <div className="flex items-center gap-3">
          {/* Search (Desktop) */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="py-2 pl-10 pr-4 bg-secondary/50 rounded-full text-sm w-[300px] focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search token or address"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Portfolio Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex">
                Portfolio
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/portfolio">View Portfolio</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/history">Transaction History</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="connect-button">
                {isConnected
                  ? `${publicKey?.toString().slice(0, 4)}...${smartWalletAuthorityPubkey?.toString().slice(-4)}`
                  : isConnected === 0
                    ? "Connecting..."
                    : "Connect"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 ">
              {!isConnected ? (
                <DropdownMenuItem onClick={connect}>Connect Wallet</DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem disabled>
                    Connected:
                    <span className="ml-1 font-mono text-xs truncate max-w-[100px]">
                      {publicKey?.toString().slice(0, 4)}...
                      {smartWalletAuthorityPubkey?.toString().slice(-4)}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(publicKey?.toString() || "")
                      toast.success("Copied address to clipboard")
                    }}
                  >
                    <Copy className="w-4 h-4 " />
                    Copy Address
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-red-500 focus:text-red-500"
                  >
                    Disconnect
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>


          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/90 backdrop-blur-md border-t border-border px-4 py-4 space-y-4">
          <div className="flex flex-col gap-3">
            <NavLink href="/">Spot</NavLink>
            <NavLink href="/pro">Pro</NavLink>
            <NavLink href="/perps">Perps</NavLink>
            <NavLink href="/stats">Stats</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground">
              Portfolio
            </Link>
            <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground">
              Transaction History
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 bg-secondary/50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search token or address"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Mobile Wallet Connection */}
          <div className="pt-4 border-t border-border">
            {isConnected ? (
              <Button
                variant="destructive"
                className="w-full"
                onClick={disconnect}
              >
                Disconnect Wallet
              </Button>
            ) : (
              <Button
                onClick={connect}
                disabled={isConnected === 0}
                className="w-full"
              >
                {isConnected === 0 ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({
  href,
  active = false,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors px-4 py-2 rounded-lg",
        active
          ? "text-foreground font-medium bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      {children}
    </Link>
  )
}