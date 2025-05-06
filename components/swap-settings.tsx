"use client"

import type React from "react"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function SwapSettings({
  slippage,
  onSlippageChange,
}: {
  slippage: number
  onSlippageChange: (value: number) => void
}) {
  const [customSlippage, setCustomSlippage] = useState<string>("")
  const [showCustomSlippage, setShowCustomSlippage] = useState(false)

  const defaultSlippageOptions = [0.1, 0.5, 1.0]

  const handleSliderChange = (value: number[]) => {
    onSlippageChange(value[0])
  }

  const handleCustomSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setCustomSlippage(value)
    if (value && !isNaN(Number.parseFloat(value))) {
      onSlippageChange(Number.parseFloat(value))
    }
  }

  return (
    <div className="bg-secondary/10 rounded-lg p-3 mb-4">
      <div className="mb-2">
        <Label className="text-sm font-medium">Slippage Tolerance</Label>
        <div className="flex items-center gap-2 mt-1.5">
          {defaultSlippageOptions.map((option) => (
            <button
              key={option}
              className={`px-3 py-1 rounded-lg text-xs ${
                slippage === option && !showCustomSlippage
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
              onClick={() => {
                onSlippageChange(option)
                setShowCustomSlippage(false)
              }}
            >
              {option}%
            </button>
          ))}
          <button
            className={`px-3 py-1 rounded-lg text-xs ${
              showCustomSlippage ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"
            }`}
            onClick={() => setShowCustomSlippage(true)}
          >
            Custom
          </button>
        </div>
        {showCustomSlippage && (
          <div className="mt-2 relative">
            <Input
              type="text"
              placeholder="Enter slippage"
              value={customSlippage}
              onChange={handleCustomSlippageChange}
              className="pr-6"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">%</span>
          </div>
        )}
        <div className="mt-3">
          <Slider value={[slippage]} min={0.1} max={5} step={0.1} onValueChange={handleSliderChange} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.1%</span>
            <span>5%</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">Transaction Settings</Label>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Gas Price</span>
          <Badge variant="outline" className="text-xs">
            Auto
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Expiry</span>
          <Badge variant="outline" className="text-xs">
            Never
          </Badge>
        </div>
      </div>
    </div>
  )
}
