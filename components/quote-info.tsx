"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function QuoteInfo() {
  const [isOpen, setIsOpen] = useState(false)

  // Mocked data - replace with actual data from Jupiter API
  const quoteInfo = {
    route: "USDC → SOL",
    fee: "$0.006",
    priceImpact: "0.04%",
    minOutput: "0.0342 SOL",
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mt-2">
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between py-1 text-xs text-muted-foreground hover:text-foreground">
          <span>Route details</span>
          <ChevronRight className={`h-3 w-3 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Route</span>
          <span>{quoteInfo.route}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Network fee</span>
          <span>{quoteInfo.fee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price impact</span>
          <span className="text-green-500">{quoteInfo.priceImpact}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Minimum output</span>
          <span>{quoteInfo.minOutput}</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
