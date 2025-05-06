"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWallet } from "@/hooks/use-wallet"
import type { Token } from "@/types/token"
import { TOP_TOKENS } from "@/constants/tokens"

export function TokenSelector({
  selectedToken,
  onSelect,
  otherToken,
}: {
  selectedToken: Token
  onSelect: (token: Token) => void
  otherToken?: Token
}) {
  const { connected } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch token list
  const { data: tokens, isLoading } = useQuery({
    queryKey: ["tokenList"],
    queryFn: async () => {
      // In a real implementation, fetch from an API
      return TOP_TOKENS
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  // Fetch user token balances
  const { data: tokenBalances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ["tokenBalances"],
    queryFn: async () => {
      // In a real implementation, fetch from the blockchain
      return TOP_TOKENS.reduce(
        (acc, token) => {
          acc[token.address] = Math.random() * 100
          return acc
        },
        {} as Record<string, number>,
      )
    },
    enabled: connected,
    staleTime: 30000, // 30 seconds
  })

  // Filter tokens based on search query
  const filteredTokens = tokens?.filter((token) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      token.symbol.toLowerCase().includes(searchLower) ||
      token.name.toLowerCase().includes(searchLower) ||
      token.address.toLowerCase().includes(searchLower)
    )
  })

  // Sort tokens: first by balance (if connected), then alphabetically
  const sortedTokens = [...(filteredTokens || [])].sort((a, b) => {
    if (connected && tokenBalances) {
      const balanceA = tokenBalances[a.address] || 0
      const balanceB = tokenBalances[b.address] || 0
      if (balanceA > 0 && balanceB === 0) return -1
      if (balanceA === 0 && balanceB > 0) return 1
      if (balanceA !== balanceB) return balanceB - balanceA
    }
    return a.symbol.localeCompare(b.symbol)
  })

  // Filter out the other selected token
  const availableTokens = sortedTokens.filter((token) => !otherToken || token.address !== otherToken.address)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="token-selector flex items-center space-x-2 rounded-full pl-1 pr-2 py-1">
          <img
            src={selectedToken.logoURI || "/placeholder.svg"}
            alt={selectedToken.symbol}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-medium">{selectedToken.symbol}</span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or address"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </DialogHeader>

        {/* Common tokens */}
        <div className="flex flex-wrap gap-2 my-2">
          {TOP_TOKENS.slice(0, 6).map((token) => (
            <button
              key={token.address}
              className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm ${
                token.address === selectedToken.address
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
              onClick={() => {
                onSelect(token)
                setIsOpen(false)
              }}
              disabled={token.address === otherToken?.address}
            >
              <img src={token.logoURI || "/placeholder.svg"} alt={token.symbol} className="w-4 h-4 rounded-full" />
              <span>{token.symbol}</span>
            </button>
          ))}
        </div>

        {/* Token list */}
        {isLoading ? (
          <div className="space-y-2 py-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-1 p-1">
              {availableTokens.map((token) => (
                <button
                  key={token.address}
                  className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary ${
                    token.address === selectedToken.address ? "bg-secondary" : ""
                  }`}
                  onClick={() => {
                    onSelect(token)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={token.logoURI || "/placeholder.svg"}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{token.name}</div>
                    </div>
                  </div>
                  {connected && tokenBalances && (
                    <div className="text-right">
                      <div className="font-medium">
                        {tokenBalances[token.address]?.toFixed(token.decimals > 6 ? 6 : token.decimals) || "0"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${((tokenBalances[token.address] || 0) * (token.price || 0)).toFixed(2)}
                      </div>
                    </div>
                  )}
                </button>
              ))}
              {availableTokens.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No tokens found</div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
