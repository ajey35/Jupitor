"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useWallet } from "@/hooks/use-wallet"
import { useJupiter } from "@/hooks/use-jupiter"
import { TokenSelector } from "@/components/token-selector"
import { PriceChart } from "@/components/price-chart"
import { SwapSettings } from "@/components/swap-settings"
import { QuoteInfo } from "@/components/quote-info"
import type { Token } from "@/types/token"
import type { SwapMode, SwapTab } from "@/types/swap"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FlipHorizontalIcon as SwapHorizontal, Settings, Rocket, Clock } from "lucide-react"
import { formatTokenAmount, calculateUsdValue } from "@/lib/format"
import { NATIVE_SOL, USDC_TOKEN } from "@/constants/tokens"

export default function SwapContainer() {
  const { connected } = useWallet()
  const [inputToken, setInputToken] = useState<Token>(USDC_TOKEN)
  const [outputToken, setOutputToken] = useState<Token>(NATIVE_SOL)
  const [inputAmount, setInputAmount] = useState<string>("5")
  const [swapMode, setSwapMode] = useState<SwapMode>("EXACT_IN")
  const [activeTab, setActiveTab] = useState<SwapTab>("instant")
  const [showSettings, setShowSettings] = useState(false)
  const [slippage, setSlippage] = useState(0.5)
  const [isSwapping, setIsSwapping] = useState(false)

  const { getQuote, executeSwap } = useJupiter()

  // Switch input and output tokens
  const handleSwitchTokens = () => {
    setInputToken(outputToken)
    setOutputToken(inputToken)
    setSwapMode(swapMode === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN")
  }

  // Get input token balance
  const { data: inputBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["tokenBalance", inputToken?.address],
    queryFn: async () => 10, // Mocked balance, replace with actual balance fetch
    enabled: !!inputToken?.address && connected,
    staleTime: 30000,
  })

  // Get USDC price for input token
  const { data: inputTokenPrice } = useQuery({
    queryKey: ["tokenPrice", inputToken?.address],
    queryFn: async () => 1, // Mocked price for USDC, replace with actual price fetch
    enabled: !!inputToken?.address,
  })

  // Get USDC price for output token
  const { data: outputTokenPrice } = useQuery({
    queryKey: ["tokenPrice", outputToken?.address],
    queryFn: async () => 143.2, // Mocked price for SOL, replace with actual price fetch
    enabled: !!outputToken?.address,
  })

  // Get swap quote when input amount or tokens change
  const { data: quote, isLoading: isLoadingQuote } = useQuery({
    queryKey: ["swapQuote", inputToken?.address, outputToken?.address, inputAmount, slippage],
    queryFn: async () => {
      if (!inputToken || !outputToken || !inputAmount || Number.parseFloat(inputAmount) === 0) {
        return null
      }
      try {
        return await getQuote({
          inputToken,
          outputToken,
          amount: inputAmount,
          slippage,
          swapMode,
        })
      } catch (error) {
        console.error("Error fetching quote:", error)
        return null
      }
    },
    enabled: !!inputToken?.address && !!outputToken?.address && !!inputAmount && Number.parseFloat(inputAmount) > 0,
    staleTime: 10000,
    refetchInterval: 10000,
  })

  // Calculate estimated output amount based on the quote
  const estimatedOutputAmount = quote
    ? swapMode === "EXACT_IN"
      ? (Number.parseFloat(inputAmount) / (outputTokenPrice || 1)).toFixed(9)
      : inputAmount
    : "0"

  // Calculate USD values
  const inputUsdValue = calculateUsdValue(inputAmount, inputTokenPrice)
  const outputUsdValue = calculateUsdValue(estimatedOutputAmount, outputTokenPrice)

  // Handle swap execution
  const handleSwap = async () => {
    if (!connected) return

    try {
      setIsSwapping(true)

      // Mocked swap execution, replace with actual swap
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset after swap
      setInputAmount("")
    } catch (error) {
      console.error("Swap failed:", error)
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <div className="swap-container max-w-md w-full rounded-2xl">
      <div className="p-4">
        {/* Swap tabs */}
        <div className="flex justify-center space-x-2 mb-4">
          <SwapTabComponent
            active={activeTab === "instant"}
            onClick={() => setActiveTab("instant")}
            icon={<SwapHorizontal className="h-4 w-4 mr-1" />}
            label="Instant"
          />
          <SwapTabComponent
            active={activeTab === "trigger"}
            onClick={() => setActiveTab("trigger")}
            icon={<Rocket className="h-4 w-4 mr-1" />}
            label="Trigger"
          />
          <SwapTabComponent
            active={activeTab === "recurring"}
            onClick={() => setActiveTab("recurring")}
            icon={<Clock className="h-4 w-4 mr-1" />}
            label="Recurring"
          />
        </div>

        {/* Swap mode toggle */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">{swapMode === "EXACT_IN" ? "Selling" : "Buying"}</span>
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Input token section */}
        <div className="bg-secondary/20 rounded-xl p-3 mb-1">
          <div className="flex justify-between mb-2">
            <TokenSelector selectedToken={inputToken} onSelect={setInputToken} otherToken={outputToken} />
            <div className="flex flex-col items-end">
              <input
                type="text"
                inputMode="decimal"
                className="token-amount-input text-right"
                value={inputAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "")
                  setInputAmount(value)
                }}
                placeholder="0"
              />
              {inputTokenPrice && <span className="text-sm text-muted-foreground">${inputUsdValue}</span>}
            </div>
          </div>
          {connected && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Balance:{" "}
                {isLoadingBalance ? (
                  <Skeleton className="h-4 w-16 inline-block" />
                ) : (
                  formatTokenAmount(inputBalance || 0, inputToken.decimals)
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-primary"
                onClick={() => setInputAmount(inputBalance?.toString() || "0")}
              >
                MAX
              </Button>
            </div>
          )}
        </div>

        {/* Switch tokens button */}
        <div className="flex justify-center -my-3 relative z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full bg-background border-border"
            onClick={handleSwitchTokens}
          >
            <SwapHorizontal className="h-3 w-3" />
          </Button>
        </div>

        {/* Output token section */}
        <div className="bg-secondary/20 rounded-xl p-3 mb-4">
          <div className="flex justify-between mb-2">
            <TokenSelector selectedToken={outputToken} onSelect={setOutputToken} otherToken={inputToken} />
            <div className="flex flex-col items-end">
              <div className="token-amount-input text-right">
                {isLoadingQuote ? <Skeleton className="h-8 w-28 inline-block" /> : estimatedOutputAmount}
              </div>
              {outputTokenPrice && <span className="text-sm text-muted-foreground">${outputUsdValue}</span>}
            </div>
          </div>
        </div>

        {/* Swap settings */}
        {showSettings && <SwapSettings slippage={slippage} onSlippageChange={setSlippage} />}

        {/* Exchange rate info */}
        {inputAmount && Number.parseFloat(inputAmount) > 0 && (
          <div className="bg-secondary/10 rounded-lg p-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span>
                1 {outputToken.symbol} = {outputTokenPrice} {inputToken.symbol}
              </span>
            </div>
            <QuoteInfo />
          </div>
        )}

        {/* Price chart */}
        <div className="mb-4">
          <PriceChart baseToken={inputToken} quoteToken={outputToken} />
        </div>

        {/* Connect/Swap button */}
        <Button
          className="connect-button w-full h-12 text-lg font-semibold"
          disabled={isSwapping || !inputAmount || Number.parseFloat(inputAmount) === 0}
          onClick={connected ? handleSwap : undefined}
        >
          {!connected ? (
            "Connect"
          ) : isSwapping ? (
            <div className="flex items-center">
              <svg className="loading-spinner mr-2 h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Swapping...
            </div>
          ) : Number.parseFloat(inputAmount) > (inputBalance || 0) ? (
            "Insufficient balance"
          ) : (
            "Swap"
          )}
        </Button>
      </div>
    </div>
  )
}

function SwapTabComponent({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      className={`flex items-center px-4 py-2 rounded-lg text-sm ${
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}
